import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { err } from '@src/utils';
import { Insertable, Selectable, Updateable } from 'kysely';


type Table = DB['payment'];
const table = 'payment';
type Filter = Partial<Selectable<Table>>;
type Insert = Insertable<Table> & { permit_id: string };
type Edit = Updateable<Table>;

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table);
  if (p.uuid) q = q.where('uuid', '=', p.uuid);

  return q.selectAll().executeTakeFirst();
};

const create = async (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = async (uuid: string, p: Edit) => {
  return db.updateTable(table).where('uuid', '=', uuid).set(p).returningAll().executeTakeFirst();
};

// online ofline toleg
const addPayment = async (p: Insert) => {
  return await db.transaction().execute(async (trx) => {
    const payment = await trx
      .insertInto(table)
      .values(p)
      .returningAll()
      .executeTakeFirst();

    if (!payment) throw err.InternalServerError('Payment not created');

    const updatedPermit = await trx
      .updateTable('permit')
      .set({ is_paid: true })
      .where('uuid', '=', p.permit_id)
      .executeTakeFirst();

    if (!updatedPermit) throw err.InternalServerError('Permit not updated');

    return true;
  });
};


// ofline toleg
const addPaymentOfline = async (p: Insert, status: number) => {
  return await db.transaction().execute(async (trx) => {
    const payment = await trx
      .insertInto(table)
      .values(p)
      .returningAll()
      .executeTakeFirst();

    if (!payment) throw err.InternalServerError('Payment not created');

    const updatedPermit = await trx
      .updateTable('permit')
      .set({ status, is_paid: true })
      .where('uuid', '=', p.permit_id)
      .executeTakeFirst();

    if (!updatedPermit) throw err.InternalServerError('Permit not updated status, is_paid');

    return true;
  });
};


export const paymentRepo = {
  edit,
  create,
  findOne,
  addPayment,
  addPaymentOfline
};