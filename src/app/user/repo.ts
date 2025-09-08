import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { UserGetAll } from '@src/api/schema/user';
import { Insertable, Selectable, sql, Updateable } from 'kysely';

type Table = DB['users'];
const table = 'users';
type Filter = Partial<Selectable<Table> & UserGetAll>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getAll = async (p: Filter & LimitOffset) => {
  let q = db.selectFrom(table);

  if (p.text) q = q.where('name', 'ilike', `%${p.text}%`);
  if (p.text) q = q.where('email', 'ilike', `%${p.text}%`);

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();
  const users = await q
    .select([
      'uuid',
      'user_id',
      'phone',
      'name',
      'email',
      'deposit_legal',
      'deposit_individual',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('created_at', 'desc')
    .execute();
  return {
    count: Number(c?.c),
    users
  };
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

const getUserHistory = async () => {
  return await db
    .selectFrom('epermit_ledger_permits as elp')
    .leftJoin('permit as p', (join) => join.on('elp.company_id', '=', sql`p.uuid::text`))
    .leftJoin('users as u', 'p.auth_id', 'u.uuid')
    .select([
      'elp.permit_id',
      sql<string>`COALESCE(u.name, '')`.as('name'),
      sql<string>`COALESCE(elp.company_name, '')`.as('company_name'),
      sql<number>`COALESCE(u.deposit_legal, 0) + COALESCE(u.deposit_individual, 0)`.as('left_deposit'),
      sql<Date>`elp.created_at`.as('date'),
    ])
    .execute()
}

const getUserHistoryByUUID = async (userId: string) => {
  return await db
    .selectFrom('epermit_ledger_permits')
    .leftJoin('permit', (join) => join.on(sql`epermit_ledger_permits.company_id::uuid`, '=', `permit.uuid`))
    // .leftJoin('permit', (join) => join.on('epermit_ledger_permits.company_id', '=', sql`permit.uuid::text`))
    .leftJoin('users', 'permit.auth_id', 'users.uuid')
    .select((eb) => [
      'epermit_ledger_permits.permit_id',
      sql<string>`COALESCE(users.name, '')`.as('name'),
      sql<string>`COALESCE(epermit_ledger_permits.company_name, '')`.as('company_name'),
      sql<number>`COALESCE(users.deposit_legal, 0) + COALESCE(users.deposit_individual, 0)`.as('left_deposit'),
      sql<Date>`epermit_ledger_permits.created_at`.as('date'),
    ])
    .where('users.uuid', '=', userId)
    .execute()
}


const getPermitsByUserId = async (userId: string) => {
  return await db
    .selectFrom('epermit_ledger_permits')
    .leftJoin('permit', 'epermit_ledger_permits.company_id', 'permit.uuid')
    .leftJoin('users', 'permit.auth_id', 'users.uuid')
    .select((eb) => [
      'epermit_ledger_permits.permit_id',
      sql<string>`COALESCE(users.name, '')`.as('name'),
      sql<string>`COALESCE(epermit_ledger_permits.company_name, '')`.as('company_name'),
      sql<number>`COALESCE(users.deposit_legal, 0) + COALESCE(users.deposit_individual, 0)`.as('left_deposit'),
      sql<Date>`epermit_ledger_permits.created_at`.as('date'),
    ])
    .where('users.uuid', '=', userId)
    .execute()
}

export const userRepo = {
  create,
  edit,
  findOne,
  getAll,
  getOne,
  getUserHistoryByUUID,
  getUserHistory,
};
