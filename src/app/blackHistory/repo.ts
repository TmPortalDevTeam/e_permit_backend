import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { BlackHistoryGetAll } from '@src/api/schema/blackHistory';
import { Insertable, Selectable, Updateable } from 'kysely';

type Table = DB['black_history'];
const table = 'black_history';
type Filter = Partial<Selectable<Table> & BlackHistoryGetAll>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getAll = async (p: Filter & LimitOffset) => {
    let q = db.selectFrom(table);

    if (p.text) q = q.where('company_name', 'ilike', `%${p.text}%`);

    const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();

    const companies = await q
        .select(['uuid', 'permit_id', 'company_name', 'moved_at'])
        .limit(p.limit)
        .offset(p.offset)
        .orderBy('moved_at', 'desc')
        .execute();
    return {
        count: Number(c?.c),
        companies
    };
};

const getOne = (id: string) => {
    return db
        .selectFrom(table)
        .where('uuid', '=', id)
        .select(['uuid', 'permit_id', 'company_name', 'moved_at'])
        .executeTakeFirst();
};

const findOne = async (p: Filter) => {
    let q = db.selectFrom(table);
    if (p.uuid) q = q.where('uuid', '=', p.uuid);
    if (p.text) q = q.where('company_name', '=', p.text);

    return q.selectAll().executeTakeFirst();
};

const create = async (p: Insert) => {
    return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = async (uuid: string, p: Edit) => {
    return db.updateTable(table).where('uuid', '=', uuid).set(p).returningAll().executeTakeFirst();
};

export const blackHistoryRepo = {
    getAll,
    getOne,
    create,
    edit,
    findOne,
};