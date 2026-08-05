import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.url().default("http://localhost:3000"),
  ROOT_DOMAIN: z.string().default("localhost:3000"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  API_KEY_PEPPER: z.string().min(32).optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional()
});

export const env = envSchema.parse({
  APP_URL: process.env.APP_URL,
  ROOT_DOMAIN: process.env.ROOT_DOMAIN,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  API_KEY_PEPPER: process.env.API_KEY_PEPPER,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
});
