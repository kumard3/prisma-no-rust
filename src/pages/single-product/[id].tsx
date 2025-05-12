import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";

export default function SingleProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = api.product.getSingleProduct.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    },
  );
  return (
    <div>
      {data?.name}
      {data?.image}
      {data?.price}
    </div>
  );
}
