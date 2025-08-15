import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { AdminGetAll } from '@src/api/schema/admin';
import { Insertable, Selectable } from 'kysely';

const tableRole = 'roles';

type Table = DB['admins'];
const table = 'admins';
type Filter = Partial<Selectable<Table> & AdminGetAll>;
type Insert = Insertable<Table>;

const create = (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const remove = (uuid: string) => {
  return db.deleteFrom(table).where('uuid', '=', uuid).returningAll().executeTakeFirst();
};

const getAll = async (p: Filter & LimitOffset) => {
  let q = db
    .selectFrom(table)
    .leftJoin('roles', 'admins.role_id', 'roles.uuid');

  if (p.uuid) q = q.where('admins.uuid', '=', p.uuid);
  if (p.username) q = q.where('admins.username', '=', p.username);
  if (p.name) q = q.where('admins.name', '=', p.name);
  if (p.role) q = q.where('admins.role_id', '=', p.role);

  if (p.text) {
    q = q.where(o =>
      o.or([
        o('username', 'ilike', `%${p.text}%`),
        o('name', 'ilike', `%${p.text}%`),
        o('roles.name', 'ilike', `%${p.text}%`),
      ]),
    );
  }

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();
  
  const data = await q
    .select([
      'admins.uuid',
      'admins.username',
      'admins.name',
      'roles.name as role',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('username', p.sortDirection)
    .execute();
  return { count: Number(c?.c), data };
};

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table).leftJoin('roles', 'admins.role_id', 'roles.uuid');

  if (p.uuid) q = q.where('admins.uuid', '=', p.uuid);
  if (p.username) q = q.where('admins.username', '=', p.username);
  if (p.password_name) q = q.where('admins.password_name', '=', p.password_name);
  if (p.name) q = q.where('admins.name', '=', p.name);
  if (p.role_id) q = q.where('admins.role_id', '=', p.role_id);

  const result = await q.
    select([
      'admins.uuid',
      'admins.username',
      'admins.password',
      'admins.password_name',
      'admins.name',
      'roles.uuid as role_id',
      'roles.name as role_name',
    ])
    .executeTakeFirst();

  return result
};

const getRoles = async () => {
  let q = db.selectFrom(tableRole)
  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();
  const data = await q
    .select(['uuid', 'name'])
    .orderBy('name', 'asc')
    .execute();
  return { count: Number(c?.c), data };
};

const findOneByIdRole = async (uuid: string) => {
  return await db
    .selectFrom(tableRole)
    .select(['uuid', 'name'])
    .where('uuid', '=', uuid)
    .executeTakeFirst();
};


export const adminRepo = {
  getAll,
  findOne,
  create,
  remove,
  getRoles,
  findOneByIdRole,
};
