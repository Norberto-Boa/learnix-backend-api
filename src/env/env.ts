<<<<<<< HEAD
import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

// Parse immediately, throws if invalid
export const env = envSchema.parse(process.env);
=======
import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
>>>>>>> 01d1b7dda5cee4b56ccd8ce63e5e8151af2076ff
