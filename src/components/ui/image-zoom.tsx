/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

import { useEffect } from "react";

import { useRef } from "react";

import { useState } from "react";

import { createPortal } from "react-dom";

import Image from "next/image";
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface ImageZoomProps {
  src: string;
  alt?: string;
}

export const ImageZoom: React.FC<ImageZoomProps> = ({
  src,
  alt = "Zoomable image",
}) => {
  // State for image dimensions, mouse position, zoom visibility, and panel position
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });
  const [zoomPosition, setZoomPosition] = useState<Position>({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState<boolean>(false);
  const [panelPosition, setPanelPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Zoom settings
  const zoomFactor = 2; // 2x magnification
  const zoomWidth = 300; // Zoom panel width in pixels
  const zoomHeight = 300; // Zoom panel height in pixels

  // Check if the device is desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // Common breakpoint for desktop
    };

    // Initial check
    checkIfDesktop();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfDesktop);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);

  // Throttle the mouse move handler to improve performance
  const handleMouseMove = throttle((e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width; // Fraction of image width
      const y = (e.clientY - top) / height; // Fraction of image height
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        setZoomPosition({ x, y });
        setIsZoomVisible(true);
      } else {
        setIsZoomVisible(false);
      }
    }
  }, 16); // ~60fps (1000ms / 60fps ≈ 16ms)

  // Hide zoom panel when mouse leaves
  const handleMouseLeave = useCallback(() => {
    setIsZoomVisible(false);
  }, []);

  // Position the zoom panel to the right of the image
  useEffect(() => {
    if (imageRef.current && isZoomVisible && isDesktop) {
      const { left, top, width } = imageRef.current.getBoundingClientRect();
      const margin = 10; // Space between image and panel
      const panelX = left + width + margin; // Right of the image
      const panelY = top; // Align with the top of the image

      // Adjust if panel would go off-screen
      const viewportWidth = window.innerWidth;
      const adjustedX =
        panelX + zoomWidth > viewportWidth ? left - zoomWidth - margin : panelX;

      setPanelPosition({ x: adjustedX, y: panelY });
    }
  }, [isZoomVisible, zoomWidth, isDesktop]);

  // Calculate background position for the zoom panel
  const calculateBgPosition = useCallback(() => {
    if (imageDimensions.width === 0 || imageDimensions.height === 0) {
      return { bgX: 50, bgY: 50 }; // Default to center (percentage values)
    }

    // We'll use percentage-based positioning instead of pixel-based
    // This allows us to use "center center" as the base position

    // Convert mouse position (0-1) to percentage (0-100)
    // Adjust from center (50%) based on mouse position
    const bgX = 50 - (zoomPosition.x - 0.5) * 100;
    const bgY = 50 - (zoomPosition.y - 0.5) * 100;

    // No need to clamp values when using percentage-based positioning
    // The browser will handle this automatically with background-position

    return { bgX, bgY };
  }, [zoomPosition, imageDimensions]);

  const { bgX, bgY } = calculateBgPosition();
  console.log(isZoomVisible, isDesktop);
  return (
    <div
      ref={imageRef}
      className="relative"
      style={{
        width: "100%",
        aspectRatio:
          imageDimensions.width && imageDimensions.height
            ? `${imageDimensions.width} / ${imageDimensions.height}`
            : "1 / 1",
      }}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      onMouseDown={isDesktop ? handleMouseLeave : undefined}
      onMouseOut={isDesktop ? handleMouseLeave : undefined}
    >
      <style jsx global>{`
        .image-zoom-container {
          position: relative;
          max-width: 500px; /* Adjust based on your design */
          margin: 0 auto;
          overflow: hidden;
          cursor: zoom-in;
        }
        .main-image {
          display: block;
          object-fit: contain;
          height: 400px !important;
          margin: auto !important;
        }
        .zoomed-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 250%;
          pointer-events: none;
          transition: opacity 0.1s ease-in-out;
        }
        .image-zoom-container {
          width: 300px; /* Adjust to your shaft image size */
          height: 100px; /* Adjust as needed */
        }
      `}</style>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="h-full w-full object-contain p-2"
        unoptimized
        loading="lazy"
        onLoadingComplete={(img) =>
          setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
        }
      />
      {isZoomVisible &&
        isDesktop &&
        createPortal(
          <div className="flex items-center justify-center">
            <div
              className="zoomed-image absolute rounded-xl border bg-white"
              style={{
                width: `${zoomWidth}px`,
                height: `${zoomHeight}px`,
                top: `${panelPosition.y}px`,
                left: `${panelPosition.x}px`,
                backgroundImage: `url("${src}")`,
                backgroundSize: `${imageDimensions.width * zoomFactor}px ${imageDimensions.height * zoomFactor}px`,
                backgroundPosition: `${bgX}% ${bgY}%`,
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                zIndex: 1000,
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
