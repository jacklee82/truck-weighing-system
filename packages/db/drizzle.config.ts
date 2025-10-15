import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
	path: "../../apps/web/.env.local",
});

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
