import { envSchema } from './env';

export const envCheck = async () => {
  await envSchema.parseAsync(process.env);
};
