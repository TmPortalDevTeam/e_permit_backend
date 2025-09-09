import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { userContract } from '@src/api/contracts/user';
import { userService as service } from './service';
import { PaymentFieldsSchema } from '@src/api/schema/common';
import { validateOfflinePayment } from './middleware';


export const userRouter = s.router(userContract, {
  getAll: {
    hooks: { preHandler: [auth, checkRole(['superadmin'])] },
    handler: async ({ query }) => {
      const r = await service.getUsers(query);
      return { status: 200, body: r };
    },
  },
  create: {
    handler: async ({ body }) => {
      const r = await service.AddUsers(body);
      return { status: 201, body: r };
    },
  },
  addDeposit: {
    handler: async ({ params, body }) => {
      const r = await service.addDeposit(params.uuid, body);
      return { status: 200, body: r };
    },
  },
  removeDeposit: {
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
    handler: async ({ body }) => {
      const r = await service.getDepositBalance(body);
      return { status: 200, body: r };
    },
  },
  // online toleg
  addPayment: {
    handler: async ({ body }) => {
      const r = await service.addPayment(body);
      return { status: 200, body: r };
    },
  },
  // ofline toleg
  addOflinePayment: {
    hooks: { preHandler: validateOfflinePayment },
    handler: async ({ request }) => {

      const file = request.uploadedFile;
      const data: PaymentFieldsSchema = request.validatedPayment!;

      await service.BPaUSaCP(file, data)
      return { status: 201, body: true };
    },
  },

  history: {
    handler: async () => {
      const r = await service.getPermitsByUserId();
      return { status: 200, body: r };
    },
  },
  usr_history: {
    handler: async ({ params }) => {
      const r = await service.getUserHistoryByUUID(params.uuid);
      return { status: 200, body: r };
    },
  },
});