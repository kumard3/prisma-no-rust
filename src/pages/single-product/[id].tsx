import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SingleProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: product, isLoading } = api.product.getSingleProduct.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    },
  );

  // Function to get a placeholder image URL
  const getPlaceholderImage = (productId: string) => {
    // Use the last characters of the ID to get different images
    const imageId = parseInt(productId.slice(-2), 16) % 50;
    return `https://prd.place/600?id=${imageId}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center py-10">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center py-10">
        <div className="mb-4 text-lg">Product not found</div>
        <Link href="/">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/" className="mb-6 flex items-center text-sm hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || getPlaceholderImage(product.id)}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-4 text-2xl font-semibold">
            ${(product.price / 100).toFixed(2)}
          </div>

          <Separator className="my-6" />

          {product.description && (
            <div className="mt-4">
              <h2 className="text-lg font-medium">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
          )}

          <div className="mt-8">
            <Button size="lg" className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
