import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { permitService as service } from './service';
import { permitContract } from '@src/api/contracts/permit';

export const permitRouter = s.router(permitContract, {
  getQuotas: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ params }) => {
      const r = await service.getAuthorityByCode(params.code);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  getAllQuotas: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async () => {
      const r = await service.getAllAuthority();
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  addPermit: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ body }) => {
      const r = await service.createPermit(body);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  getPermits: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ query }) => {
      const r = await service.getAllPermits(query);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  getAllRejectedPermits: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ query }) => {
      const r = await service.getAllRejectedPermits(query);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  adminGetPermitID: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ params }) => {
      const r = await service.adminGetPermitID(params.id);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
});