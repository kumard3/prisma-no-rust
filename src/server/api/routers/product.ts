/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany();
    return products;
  }),
  getSingleProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });
      return product;
    }),
  getProductCount: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.product.count();
    return count;
  }),
});
