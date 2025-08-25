import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { permitService as service } from './service';
import { permitContract } from '@src/api/contracts/permit';
import { resp } from '@src/api/schema/common';

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
    handler: async ({ params }) => {
      const r = await service.adminGetPermitID(params.id);
      return {
        status: 200,
        body: { data: r }
      };
    },
  },
  adminChangestatusto3: {
    handler: async ({ body }) => {
      const r = await service.updatePermitStatusTo3(body.permitId);
      return {
        status: 200,
        body: resp.parse({ data: r })
      };
    },
  },
  adminChangestatusto4: {
    handler: async ({ body }) => {
      const r = await service.updatePermitStatusTo4(body.permitId);
      return {
        status: 200,
        body: resp.parse({ data: r })
      };
    },
  },
  adminChangestatusto7: {
    handler: async ({ body }) => {
      const r = await service.setPermitStatus(body);
      return { status: 200, body: r };
    },
  },
  adminChangePermitStatus: {
    handler: async ({ body }) => {
      const r = await service.changePermitStatus(body);
      return { status: 200, body: r };
    },
  },
  adminPermits: {
    handler: async () => {
      const r = await service.getPermits();
      return { status: 200, body: r };
    },
  },
});