import { s } from '@app/router';
import { auth, checkRole } from '../admin/auth/auth.middleware';
import { userContract } from '@src/api/contracts/user';
import { userService as service } from './service';
import { err } from '@src/utils';
import { Multipart, strDate, strInt, typePayment, uuidSchema } from '@src/api/schema/common';
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
      // const file = await request.file();
      // if (!file) throw err.BadRequest("File is required");

      // const permit_idField = file.fields.permit_id as Multipart | undefined;
      // const amountField = file.fields.amount as Multipart | undefined;
      // const typeField = file.fields.type as Multipart | undefined;
      // const pay_dateField = file.fields.pay_date as Multipart | undefined;
      // const document_numberField = file.fields.document_number as Multipart | undefined;

      // // permit_id  
      // const permit_idValue = permit_idField?.value;
      // if (!permit_idValue) throw err.BadRequest("permit_id is required");

      // const permit_idSchema = uuidSchema.safeParse(permit_idValue);
      // if (!permit_idSchema.success) throw err.BadRequest(permit_idSchema.error.errors[0].message);
      // const permit_id = permit_idSchema.data;

      // // amount   
      // const amountValue = amountField?.value;
      // if (!amountValue) throw err.BadRequest("amount is required");

      // const amountSchema = strInt.safeParse(amountValue);
      // if (!amountSchema.success) throw err.BadRequest(amountSchema.error.errors[0].message);
      // const amount = amountSchema.data;

      // // type 
      // const typeValue = typeField?.value;
      // if (!typeValue) throw err.BadRequest("type is required");

      // const typeSchema = typePayment.safeParse(typeValue);
      // if (!typeSchema.success) throw err.BadRequest(typeSchema.error.errors[0].message);
      // const type = typeSchema.data;

      // // pay_dateField YYYY-MM-DD
      // const pay_dateFieldValue = pay_dateField?.value;
      // if (!pay_dateFieldValue) throw err.BadRequest("pay_date is required");

      // const pay_dateSchema = strDate.safeParse(pay_dateFieldValue);
      // if (!pay_dateSchema.success) throw err.BadRequest(pay_dateSchema.error.errors[0].message);
      // const pay_date = pay_dateSchema.data;

      // // document_number 
      // const document_number = document_numberField?.value;
      // if (!document_number) throw err.BadRequest("document_number is required");


      // console.log("Файл:", file.filename, file.mimetype);
      // console.log("permit_id:", permit_id);
      // console.log("amount:", amount);
      // console.log("type:", type);
      // console.log("pay_date:", pay_date);
      // console.log("document_number:", document_number);

      // const r = await service.addPayment(body);

      const { permit_id, amount, type, pay_date, document_number } = request.validatedPayment!;
      const file = request.uploadedFile;

      console.log("obj: ", { permit_id, amount, type, pay_date, document_number });
      console.log("Файл: ", file.filename, file.mimetype);

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