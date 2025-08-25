import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { permitService as service } from './service';
import { permitContract } from '@src/api/contracts/permit';
import { resp } from '@src/api/schema/common';

export const permitRouter = s.router(permitContract, {
  adminAddPermit: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.createPermit(body);
      return { status: 200, body: r };
    },
  },
  adminGetPermit: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.getAllPermits(query);
      return { status: 200, body: r };
    },
  },
  rejectedPermit: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.rejectedPermits(query);
      return { status: 200, body: r };
    },
  },
  adminGetPermitID: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getPermitByID(params.id);
      return { status: 200, body: r };
    },
  },
  adminChangestatusto3: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.updatePermitStatusTo3(body.permitId);
      return { status: 200, body: r };
    },
  },
  adminChangestatusto4: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.updatePermitStatusTo4(body.permitId);
      return { status: 200, body: r };
    },
  },
  adminSetstatus7: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.setPermitStatus(body);
      return { status: 200, body: r };
    },
  },
  adminChangePermitStatus: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.changePermitStatus(body);
      return { status: 200, body: r };
    },
  },
  adminGetPermits: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async () => {
      const r = await service.getPermits();
      return { status: 200, body: r };
    },
  },
  adminAddPermits: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.addPermitsExternalApi(body);
      return { status: 200, body: r };
    },
  },
  adminPermitsID: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getPermitsByID(params.permitID);
      return { status: 200, body: r };
    },
  },



  getQuotas: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
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







});