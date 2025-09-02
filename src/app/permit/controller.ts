import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { permitService as service } from './service';
import { permitContract } from '@src/api/contracts/permit';
import { err } from '@src/utils';


export const permitRouter = s.router(permitContract, {
  adminAddPermit: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.createPermit(body);
      return { status: 201, body: r };
    },
  },
  adminGetPermit: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.getAllPermits(query);
      return { status: 200, body: r };
    },
  },
  rejectedPermit: {
    handler: async ({ query }) => {
      const r = await service.rejectedPermits(query);
      return { status: 200, body: r };
    },
  },
  adminGetPermitID: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
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
      return { status: 201, body: r };
    },
  },
  adminPermitsID: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getPermitsByID(params.permitID);
      return { status: 200, body: r };
    },
  },
  adminPermitsIdRevoke: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.revokePermit(params.permitID);
      return { status: 200, body: r };
    },
  },
  getPermitPDFID: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getPermitPDF(params.permitID);
      return { status: 200, body: r };
    },
  },
  findPermitID: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.findPermit(params.permitID);
      return { status: 200, body: r };
    },
  },
  getAutorities: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async () => {
      const r = await service.getAuthorities();
      return { status: 200, body: r };
    },
  },
  postAutorities: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.postAuthorities(body);
      return { status: 200, body: r };
    },
  },
  getQuotas: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getAuthorityByCode(params.code);
      return { status: 200, body: r };
    },
  },
  quotas: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params, body }) => {
      const r = await service.addQuota(params.code, body);
      return { status: 200, body: r };
    },
  },
  addPermitActivity: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params, body }) => {
      const r = await service.AddPermitActivities(params.permitID, body);
      return { status: 200, body: r };
    },
  },
  addEmail: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params, request }) => {
      const data = await request.file();
      if (!data) throw err.BadRequest('File not found in request');

      const r = await service.sendEmail(params.ledgerID, data);
      return { status: 200, body: r };
    },
  },
  permitStatus: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.getPermitStatus(params.permitUUID);
      return { status: 200, body: r };
    },
  },
});