import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { userContract } from '@src/api/contracts/user';
import { userService as service } from './service';

export const userRouter = s.router(userContract, {
  getAll: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.getUsers(query);
      return { status: 200, body: r };
    },
  },
  create: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.AddUsers(body);
      return { status: 201, body: r };
    },
  },
  addDeposit: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params, body }) => {
      const r = await service.addDeposit(params.uuid, body);
      return { status: 200, body: r };
    },
  },
  removeDeposit: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ params }) => {
      const r = await service.removeMoneyFromDeposit(params.uuid)
      return { status: 200, body: r };
    },
  },
  getBlackHistory: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.getBlackHistory(query)
      return { status: 200, body: r };
    },
  },
  getBalance: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.getDepositBalance(body);
      return { status: 200, body: r };
    },
  },
  addPayment: {
    // hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ body }) => {
      const r = await service.addPayment(body);
      return { status: 200, body: r };
    },
  },
  history: {  //	history= "/history"  DO NOT HAVE AUTHREZATION     GetUserHistory() GetUserHistory() edilmedik  epermit_ledger_permits tablisiya yok serverdada
    handler: async () => {
      const r = await service.getPermitsByUserId();
      return { status: 200, body: r };
    },
  },
  usr_history: { //	usr_history= "/history/{uuid}"        GetUserHistoryByUUID() bardede sho problem   epermit_ledger_permits tablisiya yok serverdada 
    handler: async ({ params }) => {
      const r = await service.getUserHistoryByUUID(params.uuid);
      return { status: 200, body: r };
    },
  },
});