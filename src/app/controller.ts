import { contract } from '@api/contracts';
import { s } from '@app/router';
import { authRouter } from '@src/app/admin/auth/controller';
import { adminRouter } from '@src/app/admin/controller';
import { userRouter } from '@src/app/user/controller';

export const router = s.router(contract, {
  auth: authRouter,
  admin: adminRouter,
  user: userRouter,
});
