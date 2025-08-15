import { payload, Payload } from '@src/api/schema/auth';
import { getEnv } from '@src/infra/env/service';
import jwt from 'jsonwebtoken';

const jwtSecret = getEnv('JWT_SECRET');
const jwtRefreshSecret = getEnv('JWT_REFRESH_SECRET');
const jwtAccessExpiresIn = getEnv('JWT_ACCESS_EXPIRES_IN');
const jwtRefreshExpiresIn = getEnv('JWT_REFRESH_EXPIRES_IN');


const sign = async (data: Payload) => {
  const r = await payload.parseAsync(data);
  return jwt.sign(r, jwtSecret);
};

const verify = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

const signAccessToken = async (data: Payload) => {
  const r = await payload.parseAsync(data);
  return jwt.sign(r, jwtSecret, { expiresIn: jwtAccessExpiresIn });
};

const signRefreshToken = async (data: Payload) => {
  const r = await payload.parseAsync(data);
  return jwt.sign(r, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, jwtSecret);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, jwtRefreshSecret);
};

export const jwtService = {
  sign,
  verify,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
