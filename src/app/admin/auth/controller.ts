import { authContract } from '@api/contracts/auth';
import { auth } from '@src/app/admin/auth/auth.middleware';
import { s } from '@src/app/router';
import { authService } from './service';

export const authRouter = s.router(authContract, {
  login: {
    handler: async ({ body }) => {
      const r = await authService.login(body);
      return { status: 201, body: r };
    },
  },
  me: {
    hooks: { preHandler: auth },
    handler: async ({ request }) => {
      const user = request.user;
      const r = await authService.me(user!.uuid);
      return { status: 200, body: r };
    },
  },
  logout: {
    hooks: { preHandler: auth },
    handler: async () => {
      return { status: 200, body: null };
    },
  },
});
