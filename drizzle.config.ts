import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./config/env";

const databaseUrl = env.databaseUrl;

export default defineConfig({
  out: "./drizzle",
  schema: ["./app/db/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl!,
  },
});
