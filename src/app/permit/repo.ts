import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { Insertable, Selectable, Updateable } from 'kysely';

type Table = DB['permit'];
const table = 'permit';
type Filter = Partial<Selectable<Table>>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getLastPermitUser = async (userUuid: string) => {
  return await db
    .selectFrom(table)
    .where('auth_id', '=', userUuid)
    .select(['is_legal'])
    .orderBy('created_at', 'desc')
    .executeTakeFirst();
};

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

export const permitRepo = {
  getLastPermitUser,
  edit,
  create,
  findOne,
};
