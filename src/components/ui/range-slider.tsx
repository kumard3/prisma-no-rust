import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
  thumbClassName?: string;
  trackClassName?: string;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    {
      className,
      thumbClassName,
      trackClassName,
      label,
      labelPosition = "bottom",
      ...props
    },
    ref,
  ) => {
    const initialValue = Array.isArray(props.value)
      ? props.value
      : [props.min, props.max];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range
            className={cn("absolute h-full bg-primary", trackClassName)}
          />
        </SliderPrimitive.Track>
        {initialValue.map((value, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb
              className={cn(
                "group relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                thumbClassName,
              )}
            >
              {label && (
                <span
                  className={cn(
                    "absolute hidden w-full justify-center text-xs font-semibold group-hover:flex",
                    labelPosition === "top" && "-top-7",
                    labelPosition === "bottom" && "top-4",
                  )}
                >
                  {label(value)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  },
);
RangeSlider.displayName = "RangeSlider";

export { RangeSlider };
