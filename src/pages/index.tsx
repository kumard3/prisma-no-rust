import { api } from "@/utils/api";
import { type GetStaticProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import superjson from "superjson";
import type { Product } from "@client/prisma-client";

export default function Head({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          {product.image}
          {product.name}
          {product.price}
        </div>
      ))}
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
