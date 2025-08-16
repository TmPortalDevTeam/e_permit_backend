import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { userContract } from '@src/api/contracts/user';
import { userService as service } from './service';

export const userRouter = s.router(userContract, {
  getAll: {
    hooks: { preHandler: auth },
    handler: async ({ query }) => {
      const r = await service.getAll(query);
      return { status: 200, body: r };
    },
  },
  create: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ body }) => {
      const r = await service.create(body);
      return { status: 201, body: r };
    },
  },
  // edit: {
  //   hooks: { preHandler: auth },
  //   handler: async ({ params, body }) => {
  //     const r = await service.edit(params.id, body);
  //     return { status: 201, body: r };
  //   },
  // },
  // getOne: {
  //   hooks: { preHandler: auth },
  //   handler: async ({ params }) => {
  //     const r = await service.getOne(params.id);
  //     return { status: 200, body: r };
  //   },
  // },
  // remove: {
  //   hooks: { preHandler: auth },
  //   handler: async ({ params }) => {
  //     const r = await service.remove(params.id);
  //     return { status: 201, body: r };
  //   },
  // },
});
