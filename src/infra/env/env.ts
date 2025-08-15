import { strBool } from '@src/api/schema/common';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
  HOST: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.any(),
  JWT_ACCESS_EXPIRES_IN: z.any(),
  JWT_REFRESH_EXPIRES_IN: z.any(),

  COOKIE_SECRET: z.string(),
  COOKIE_HTTP_ONLY: strBool.default(true),
  COOKIE_SECURE: strBool.default(true),
  COOKIE_SAME_SITE: z.enum(['none', 'lax', 'strict']).default('none'),
});

export type Env = z.infer<typeof envSchema>;
