import { z } from 'zod';
import { admin } from './admin';

export const payload = admin.pick({ uuid: true, role: true });
export type Payload = z.infer<typeof payload>;

export const meRes = admin.pick({
  uuid: true,
  username: true,
  password_name: true,
  name: true,
  role: true,
});

export const login = admin.pick({ username: true, password: true });
export type Login = z.infer<typeof login>;
export const loginRes = admin
  .pick({
    uuid: true,
    username: true,
    role: true,
  })
  .extend({ accessToken: z.string() });

export const authSchema = {
  payload,
  meRes,
  login,
  loginRes
};

export type AuthSchema = {
  Login: Login;
  Payload: Payload;
};
