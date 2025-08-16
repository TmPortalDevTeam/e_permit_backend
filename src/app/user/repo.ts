import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
// import { LocationGetAll } from '@src/api/schema/user';
import { ExpressionBuilder, Insertable, Selectable, Updateable } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

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

// const getOne = (id: string) => {
//   return db
//     .selectFrom(table)
//     .where('id', '=', id)
//     .select(['id', 'name', 'parentId'])
//     .select(o => parent(o))
//     .executeTakeFirst();
// };

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table);

  if (p.user_id) q = q.where('user_id', '=', p.user_id);
  if (p.uuid) q = q.where('uuid', '=', p.uuid);

  return q.selectAll().executeTakeFirst();
};

const create = (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = (uuid: string, p: Edit) => {
  return db.updateTable(table).where('uuid', '=', uuid).set(p).returningAll().executeTakeFirst();
};

// const edit = (id: string, p: Edit) => {
//   return db.updateTable(table).where('id', '=', id).set(p).returningAll().executeTakeFirst();
// };

// const remove = (id: string) => {
//   return db.deleteFrom(table).where('id', '=', id).returningAll().executeTakeFirst();
// };

// const parent = (p: ExpressionBuilder<DB, 'locations'>) => {
//   return jsonObjectFrom(
//     p.selectFrom('locations as parent').whereRef('locations.parentId', '=', 'parent.id').selectAll('parent'),
//   ).as('parent');
// };

export const userRepo = {
  getAll,
  // getOne,
  edit,
  // remove,
  findOne,
  create,
};
