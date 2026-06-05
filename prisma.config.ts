import path from "path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// prisma CLI ne charge pas .env.local automatiquement
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: { url: process.env.DATABASE_URL! },
});
