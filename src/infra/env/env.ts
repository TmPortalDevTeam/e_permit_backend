import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string().url(),

  PORT: z.coerce.number().optional().default(3000),
  HOST: z.string(),
  HOST_PROD: z.string(),

  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.any(),
  JWT_ACCESS_EXPIRES_IN: z.any(),
  JWT_REFRESH_EXPIRES_IN: z.any(),

  DEDUCTION_AMOUNT: z.coerce.number(),

  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),

  E_PERMIT_API: z.string(),
  TUGDK_API: z.string(),

  BASIC_AUTH_USERNAME: z.string(),
  BASIC_AUTH_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;