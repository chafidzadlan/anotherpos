import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/neon/schema.ts",
  out: "./lib/neon/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});