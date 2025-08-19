import { LimitOffset } from '@api/schema/common';
import { db, DB } from '@infra/db/db';
import { Insertable, Selectable, Updateable } from 'kysely';
import { PemritCreate } from '@src/api/schema/permit';
import { err } from '@src/utils';

const table = 'permit';
type Table = DB['permit'];
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

//TODO 20-08-2025
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
        license_types: d.license_types,
        is_legal: d.is_legal,
        licenses: d.licenses,
        container_number: d.container_number,
        issued_for: d.issued_for,
        permit_type: d.permit_type,
        auth_id: d.auth_id
      })
      .returningAll()
      .executeTakeFirst();

    if (!permit) throw err.Conflict('Permit not created');


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
        brand: d.brand,
        type: d.type,
        card_number: d.card_number,
        card_start_date: d.card_start_date,
        card_expire_date: d.card_expire_date,
        plate_number: d.plate_number,
        foreign_plate_number: d.foreign_plate_number,
      })
      .returningAll()
      .executeTakeFirst();

    if (!transport) throw err.Conflict('transport not created');

    return permit.uuid;
  });
}


export const permitRepo = {
  getLastPermitUser,
  edit,
  create,
  createPermit,
  findOne,
};
