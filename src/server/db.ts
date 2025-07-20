// import { PrismaClient } from "generated/prisma";

// import { env } from "@/env";

// const createPrismaClient = () =>
//   new PrismaClient({
//     log:
//       env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//     errorFormat: "pretty",
//   });

// const globalForPrisma = globalThis as unknown as {
//   prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

// export const db = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "generated/prisma";
import { env } from "@/env";
import { PrismaClient } from "generated/prisma/client";
// import { PrismaClient } from "";
// import { PrismaClient } from "generated/prisma";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const db = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

// export const db = new PrismaClient();
