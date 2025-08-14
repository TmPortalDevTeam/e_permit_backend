import { Env, envSchema } from './env';

export const getEnv = <T extends keyof Env>(key: T): Env[T] => {
  const env = envSchema.parse(process.env);
  return env[key];
};
