import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[prisma] DATABASE_URL non défini — client sans adapter");
    return new PrismaClient();
  }
  const adapter = new PrismaNeonHttp(url, {});
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
