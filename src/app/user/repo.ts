import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { Insertable, Selectable, Updateable } from 'kysely';

type Table = DB['users'];
const table = 'users';
type Filter = Partial<Selectable<Table>>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getAll = async (p: Filter & LimitOffset) => {
  let q = db.selectFrom(table);

  if (p.name) q = q.where('name', 'ilike', `%${p.name}%`);
  if (p.email) q = q.where('email', 'ilike', `%${p.email}%`);

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();
  const data = await q
    .select([
      'uuid',
      'user_id',
      'name',
      'email',
      'phone',
      'deposit_legal',
      'deposit_individual',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('created_at', 'desc')
    .execute();
  return { count: Number(c?.c), data };
};

const getOne = (uuid: string) => {
  return db
    .selectFrom(table)
    .where('uuid', '=', uuid)
    .select([
      'uuid',
      'user_id',
      'name',
      'email',
      'phone',
      'deposit_legal',
      'deposit_individual',
      'created_at',
      'updated_at',
      'deposit'
    ])
    .executeTakeFirst();
};

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table);

  if (p.user_id) q = q.where('user_id', '=', p.user_id);
  if (p.uuid) q = q.where('uuid', '=', p.uuid);

  return q.selectAll().executeTakeFirst();
};

const create = async (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = async (uuid: string, p: Edit) => {
  return db.updateTable(table).where('uuid', '=', uuid).set(p).returningAll().executeTakeFirst();
};

export const userRepo = {
  create,
  edit,
  findOne,
  getAll,
  getOne,
};
