import { api } from "@/utils/api";
import { type GetStaticProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import superjson from "superjson";
import type { Product } from "@client/prisma-client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function Home({ products }: { products: Product[] }) {
  // Fetch product count from the client side
  const { data: productCount } = api.product.getProductCount.useQuery();

  // Function to get a placeholder image URL
  const getPlaceholderImage = (id: string) => {
    // Use the last characters of the ID to get different images
    const imageId = parseInt(id.slice(-2), 16) % 50;
    return `https://prd.place/400?id=${imageId}`;
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        {productCount !== undefined && (
          <Badge variant="secondary" className="text-sm">
            Total Products: {productCount}
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={product.image || getPlaceholderImage(product.id)}
                alt={product.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                ${(product.price / 100).toFixed(2)}
              </p>
              {product.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/single-product/${product.id}`} className="w-full">
                <Button variant="default" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Create helpers with the main db instance
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      db,
    },
    transformer: superjson,
  });

  // Get all head types from PRODUCT_SUBTYPES

  // Fetch data for all head types in parallel
  const responses = await helpers.product.getAllProducts.fetch();

  // Process all responses and combine the data

  return {
    props: {
      products: responses,
      trpcState: helpers.dehydrate(),
    },
    // Revalidate every 48 hours (172800 seconds)
    revalidate: 3600,
  };
};
