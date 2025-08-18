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
      return { status: 200, body: r };
    },
  },
  addDeposit: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ params, body }) => {
      const obj = { ...body, uuid: params.uuid };
      const r = await service.addDeposit(obj);
      return { status: 200, body: { data: r } };
    },
  },
  removeDeposit: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ params }) => {
      const r = await service.removeMoneyFromDeposit(params.uuid)
      return { status: 200, body: r };
    },
  },
  getBlackHistory: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ query }) => {
      const r = await service.getBlackHistory(query)
      return { status: 200, body: r };
    },
  },
  getBalance: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ body }) => {
      const r = await service.getDepositBalance(body);
      return {
        status: 200, body: r
      };
    },
  },
  addPayment: {
    hooks: {
      preHandler: [auth, checkRole(['superadmin'])]
    },
    handler: async ({ body }) => {
      const r = await service.addPayment(body);
      return { status: 200, body: r };
    },
  },
});