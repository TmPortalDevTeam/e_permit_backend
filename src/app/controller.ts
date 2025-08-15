import { contract } from '@api/contracts';
import { s } from '@app/router';
import { adminRouter } from '@src/app/admin/controller';
import { authRouter } from '@src/app/admin//auth/controller';

export const router = s.router(contract, {
  admin: adminRouter,
  auth: authRouter,
});
