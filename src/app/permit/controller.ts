import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { permitService as service } from './service';
import { permitContract } from '@src/api/contracts/permit';

export const permitRouter = s.router(permitContract, {
  getQuotas: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getAuthorityByCode(params.code);
      return { status: 200, body: { data: r } };
    },
  },
  addPermit: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body, params }) => {
      const r = await service.createPermit(body, params.code);
      return {
        status: 200, body: {
          code: params.code,
          data: body
        }
      };
    },
  },
});