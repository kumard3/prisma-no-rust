import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@client/prisma-client";
import { faker } from "@faker-js/faker";

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // Clear existing products
  await prisma.product.deleteMany({});

  // Generate between 30-40 products
  const productCount = faker.number.int({ min: 30, max: 40 });

  const products = Array.from({ length: productCount }).map(() => ({
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 500, max: 10000 }), // Price in cents (5-100 dollars)
    description: faker.commerce.productDescription(),
    image: `https://source.unsplash.com/random/300x300?product=${faker.commerce.product().toLowerCase()}`,
  }));

  // Create products one by one instead of using transaction to avoid type issues
  const createdProducts = [];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    createdProducts.push(created);
  }

  console.log(`Created ${createdProducts.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
