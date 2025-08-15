import { adminContract } from '@src/api/contracts/admin';
import { s } from '@app/router';
import { auth, checkRole } from './auth/auth.middleware';
import { adminService as service } from './service';
import { adminSchema } from '@src/api/schema/admin';


export const adminRouter = s.router(adminContract, {
  getRoles: {
    hooks: { preHandler: auth },
    handler: async () => {
      const r = await service.getRoles();
      return { status: 200, body: r }
    }
  },
  getAll: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin', 'bugalter'])]
    },
    handler: async ({ query }) => {
      const r = await service.getAll(query);
      return { status: 201, body: r };
    },
  },
  create: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ body }) => {
      const r = await service.create(body);
      const safe = adminSchema.getOneRes.parse(r);
      return { status: 201, body: safe };
    },
  },
  remove: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ params }) => {
      const r = await service.remove(params.uuid);
      const safe = adminSchema.getOneRes.parse(r);
      return { status: 201, body: safe };
    },
  },




});
