import { err } from '@src/utils';
import { ExpressionBuilder, Insertable, Selectable, Updateable } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { db, DB } from '@infra/db/db';
import { PemritCreate, PermitGetAll } from '@src/api/schema/permit';
import { LimitOffset } from '@api/schema/common';

const table = 'permit';
type Table = DB['permit'];
type Filter = Partial<Selectable<Table> & PermitGetAll>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;


/** Helpers function for repo */
const driver = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom('driver')
      .whereRef('driver.permit_id', '=', 'permit.uuid')
      .select([
        'uuid',
        'name',
        'surname',
        'patronymic',
        'driving_license_number',
        'driving_license_expired_date',
      ]))
    .as('drivers');
};

const clientIndividual = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom('client_individual')
      .whereRef('client_individual.permit_id', '=', 'permit.uuid')
      .select([
        'uuid',
        'name',
        'surname',
        'patronymic',
        'patent_number',
        'patent_expire_date'
      ]))
    .as('clientIndividual');
};

const clientLegal = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom('client_legal')
      .whereRef('client_legal.permit_id', '=', 'permit.uuid')
      .select([
        'uuid',
        'company_name',
        'address',
        'yegrpo_number',
        'yegrpo_expire_date',
        'certificate_number',
        'bank_details',
        'account_number',
        'number_of_cars',
      ]))
    .as('clientLegal');
};

const transport = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom('transport')
      .whereRef('transport.permit_id', '=', 'permit.uuid')
      .select([
        'uuid',
        'brand',
        'type',
        'card_number',
        'card_start_date',
        'card_expire_date',
        'plate_number',
        'foreign_plate_number'
      ]))
    .as('transport');
};

const users = (p: ExpressionBuilder<DB, 'permit'>) => {
  return p
    .selectFrom('users')
    .whereRef('users.uuid', '=', 'permit.auth_id')
    .select(['name'])
    .as('auth');
};

/** Start request database */
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

const createPermit = async (d: PemritCreate) => {
  return await db.transaction().execute(async (trx) => {

    const permit = await trx.insertInto(table)
      .values({
        country: d.country,
        transit_country: d.transit_country,
        type_of_cargo: d.type_of_cargo,
        departure_date: d.departure_date,
        return_date: d.return_date,
        phone: d.phone,
        email: d.email,
        city: d.city,
        region: d.region,
        license_number: d.license_number,
        license_expire_date: d.license_expire_date,
        license_types: JSON.stringify(d.license_types),
        is_legal: d.is_legal,
        licenses: JSON.stringify(d.licenses),
        container_number: d.container_number,
        issued_for: d.issued_for,
        permit_type: d.permit_type,
        auth_id: d.auth_id
      })
      .returningAll()
      .executeTakeFirst();

    if (!permit) throw err.Conflict('Permit not created');


    if (d.is_legal) {
      const clientLegal = await trx.insertInto('client_legal')
        .values({
          permit_id: permit.uuid,
          company_name: d.legal_company_name,
          address: d.legal_address,
          yegrpo_number: d.legal_yegrpo_number,
          yegrpo_expire_date: d.legal_yegrpo_expire_date,
          certificate_number: d.legal_certificate_number,
          bank_details: d.legal_bank_details,
          account_number: d.legal_account_number,
          number_of_cars: d.legal_number_of_cars,
        })
        .returningAll()
        .executeTakeFirst();

      if (!clientLegal) throw err.Conflict('client_legal not created');
    }
    else {
      const clientIndividual = await trx.insertInto('client_individual')
        .values({
          permit_id: permit.uuid,
          name: d.individual_name,
          surname: d.individual_surname,
          patronymic: d.individual_patronymic,
          patent_number: d.individual_patent_number,
          patent_expire_date: d.individual_patent_expire_date,
        })
        .returningAll()
        .executeTakeFirst();

      if (!clientIndividual) throw err.Conflict('clientindividual not created');
    }

    const driver = await trx.insertInto('driver')
      .values({
        permit_id: permit.uuid,
        name: d.driver_name,
        surname: d.driver_surname,
        patronymic: d.driver_patronymic,
        driving_license_number: d.driving_license_number,
        driving_license_expired_date: d.driving_license_expire_date,
      })
      .returningAll()
      .executeTakeFirst();

    if (!driver) throw err.Conflict('driver not created');


    const transport = await trx.insertInto('transport')
      .values({
        permit_id: permit.uuid,
        brand: JSON.stringify(d.brand),
        type: JSON.stringify(d.type),
        card_number: JSON.stringify(d.card_number),
        card_start_date: JSON.stringify(d.card_start_date),
        card_expire_date: JSON.stringify(d.card_expire_date),
        plate_number: JSON.stringify(d.plate_number),
        foreign_plate_number: JSON.stringify(d.foreign_plate_number),
      })
      .returningAll()
      .executeTakeFirst();

    if (!transport) throw err.Conflict('transport not created');

    return permit.uuid;
  });
}

const getAllPermits = async (p: LimitOffset) => {
  console.error("repo: getAllPermits")
  return await db
    .selectFrom(table)
    .selectAll(table)
    .select((eb) => [
      driver(eb),
      clientIndividual(eb),
      clientLegal(eb),
      transport(eb),
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('permit.created_at', 'desc')
    .execute();
};


const getAllRejectedPermits = async (p: Filter & LimitOffset) => {
  let q = db.selectFrom(table).where('status', '=', 7);

  if (p.text) {
    q = q.where((eb) =>
      eb.or([
        eb('country', 'ilike', `%${p.text}%`),
        eb('type_of_cargo', 'ilike', `%${p.text}%`),
      ])
    );
  }

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();

  const data = await q
    .selectAll()
    .select((eb) => [
      clientIndividual(eb),
      clientLegal(eb),
      driver(eb),
      transport(eb),
      users(eb),
      users(eb)
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('created_at', 'desc')
    .execute();

  return { count: Number(c?.c), data };
};

export const permitRepo = {
  getLastPermitUser,
  findOne,
  edit,
  create,
  createPermit,
  getAllPermits,
  getAllRejectedPermits,
};
