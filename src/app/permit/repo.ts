import { err } from '@src/utils';
import { ExpressionBuilder, Insertable, Selectable, sql, Updateable } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { db, DB } from '@infra/db/db';
import { individual, legal, PemritCreate, PermitGetAll } from '@src/api/schema/permit';
import { LimitOffset } from '@api/schema/common';

const tableDriver = 'driver';
const tableClientIndividual = 'client_individual';
const tableClientLegal = 'client_legal';
const tableTransport = 'transport';

const table = 'permit';
type Table = DB['permit'];
type Filter = Partial<Selectable<Table> & PermitGetAll>;
type FilterGetPermits = Partial<Selectable<Table>> & PermitGetAll;
// type FilterGetPermits = Omit<Partial<Selectable<Table>>, 'status'> & PermitGetAll;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;


/** Helpers function for repo */
const driver = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom(tableDriver)
      .whereRef('driver.permit_id', '=', 'permit.uuid')
      .select([
        // 'uuid',
        'name',
        'surname',
        'patronymic',
        'driving_license_number',
        'driving_license_expired_date',
      ]))
    .as('driver');
};

const clientIndividual = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom(tableClientIndividual)
      .whereRef('client_individual.permit_id', '=', 'permit.uuid')
      .select([
        // 'uuid',
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
    p.selectFrom(tableClientLegal)
      .whereRef('client_legal.permit_id', '=', 'permit.uuid')
      .select([
        // 'uuid',
        'company_name',
        'address',
        'yegrpo_number',
        'yegrpo_expire_date',
        'certificate_number',
        'bank_details',
        'account_number',
        'number_of_cars',
      ]))
    .as('client_legal');
};

const transport = (p: ExpressionBuilder<DB, 'permit'>) => {
  return jsonArrayFrom(
    p.selectFrom(tableTransport)
      .whereRef('transport.permit_id', '=', 'permit.uuid')
      .select([
        // 'uuid',
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
    .as('user');
};

const selectUsers = (eb: ExpressionBuilder<DB, 'permit'>) => {
  return jsonObjectFrom(eb
    .selectFrom('users')
    .whereRef('users.uuid', '=', 'permit.auth_id')
    .select([
      'name',
      'deposit_legal',
      'deposit_individual',
      'is_paid',
    ])).as('user');
};


/** Start request database */
const getLastPermitUser = async (userUuid: string) => {
  return await db
    .selectFrom(table)
    .where('auth_id', '=', userUuid)
    .select(['uuid', 'auth_id', 'is_legal'])
    .orderBy('created_at', 'desc')
    .executeTakeFirst();
};

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table);
  if (p.uuid) q = q.where('uuid', '=', p.uuid);

  return q.selectAll().executeTakeFirst();
};

const getOne = async (id: string) => {
  return db
    .selectFrom(table)
    .where('uuid', '=', id)
    .selectAll(table)
    .executeTakeFirst();
};


const getOneForEmail = async (company_id: string) => {
  return db
    .selectFrom(table)
    .where(sql`uuid::text`, '=', company_id)
    .selectAll(table)
    .executeTakeFirst();
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
      const legalObj = legal.parse(d);
      const clientLegal = await trx
        .insertInto(tableClientLegal)
        .values({
          permit_id: permit.uuid,
          company_name: legalObj.legal_company_name,
          address: legalObj.legal_address,
          yegrpo_number: legalObj.legal_yegrpo_number,
          yegrpo_expire_date: legalObj.legal_yegrpo_expire_date,
          certificate_number: legalObj.legal_certificate_number,
          bank_details: legalObj.legal_bank_details,
          account_number: legalObj.legal_account_number,
          number_of_cars: legalObj.legal_number_of_cars,
        })
        .returningAll()
        .executeTakeFirst();

      if (!clientLegal) throw err.Conflict('client_legal not created');
    }
    else {
      const individualObj = individual.parse(d);

      const clientIndividual = await trx
        .insertInto(tableClientIndividual)
        .values({
          permit_id: permit.uuid,
          name: individualObj.individual_name,
          surname: individualObj.individual_surname,
          patronymic: individualObj.individual_patronymic,
          patent_number: individualObj.individual_patent_number,
          patent_expire_date: individualObj.individual_patent_expire_date,
        })
        .returningAll()
        .executeTakeFirst();

      if (!clientIndividual) throw err.Conflict('clientindividual not created');
    }

    const driver = await trx
      .insertInto(tableDriver)
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


    const transport = await trx.insertInto(tableTransport)
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

const getAllPermits = async (p: FilterGetPermits & LimitOffset) => {
  let q = db.selectFrom(table).leftJoin('users', 'users.uuid', 'permit.auth_id');

  if (p.is_legal !== undefined) q = q.where('is_legal', '=', p.is_legal);
  if (p.status) q = q.where('status', '=', p.status);

  if (p.text) {
    q = q.where((eb) =>
      eb.or([
        eb('type_of_cargo', 'ilike', `%${p.text}%`),
        eb('email', 'ilike', `%${p.text}%`),
        eb('phone', 'ilike', `%${p.text}%`),
        eb('country', 'ilike', `%${p.text}%`),
      ])
    );
  }

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();

  const data = await q
    .selectAll(table)
    .select((eb) => [
      driver(eb),
      clientIndividual(eb),
      clientLegal(eb),
      transport(eb),

      'users.name as auth_name',
      'deposit_legal',
      'deposit_individual',
      'is_paid',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('permit.created_at', 'desc')
    .execute();

  return {
    count: Number(c?.c),
    data
  };
};

const getAllRejectedPermits = async (p: Filter & LimitOffset) => {
  let q = db
    .selectFrom(table)
    .where('status', '=', 7)
    .leftJoin('users', 'users.uuid', 'permit.auth_id');

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

    .selectAll(table)
    .select((eb) => [
      clientIndividual(eb),
      clientLegal(eb),
      driver(eb),
      transport(eb),
      'users.name as auth_name',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .orderBy('created_at', 'desc')
    .execute();

  return {
    count: Number(c?.c),
    data
  };
};

const getPermit = async (id: string) => {
  let q = db
    .selectFrom(table)
    .leftJoin('users', 'users.uuid', 'permit.auth_id');

  if (id) q = q.where('permit.uuid', '=', id);

  const data = await q
    .selectAll(table)
    .select((eb) => [
      clientIndividual(eb),
      clientLegal(eb),
      driver(eb),
      transport(eb),

      'users.name as auth_name',
      'is_paid',
      'deposit_legal',
    ])
    .executeTakeFirst();
  // .execute()

  return data;
};

/** Foreign table query DANGER */
const getExpiredPermits = async () => {
  return db
    .selectFrom('epermit_ledger_permits')
    .select(['permit_id', 'company_name', 'used', 'issued_at', 'issuer'])
    .where('used', '=', false)
    .where('issuer', '=', 'TM')
    .where(sql<boolean>`TO_TIMESTAMP(${sql.ref('issued_at')}, 'DD/MM/YYYY') < NOW() - INTERVAL '7 days'`)
    .execute();
};

// const getPermitCompanyIDAndEmail = async (ledgerID: string): Promise<{ companyID: string; email: string } | null> => {
//   const result = await db
//     .selectFrom('epermit_ledger_permits as elp')
//     .innerJoin('permit as p', 'elp.company_id', 'p.uuid')
//     .select((eb) => [
//       eb.ref('elp.company_id').as('companyID'),
//       eb.ref('p.email').as('email'),
//     ])
//     .where('id', '=', ledgerID)
//     .executeTakeFirst();

//   return {
//     companyID: result.companyID,
//     email: result.email,
//   };
// }
// func (r *repository) GetPermitCompanyIDAndEmail(ctx context.Context, ledgerID uuid.UUID) (uuid.UUID, string, error) {
// 	var companyID uuid.UUID
// 	var email string

// 	query := `
//         SELECT elp.company_id, p.email
//         FROM epermit_ledger_permits elp
//         JOIN permit p ON elp.company_id::text = p.uuid::text
//         WHERE elp.id = $1
//     `
// 	err := r.client.QueryRow(ctx, query, ledgerID).Scan(&companyID, &email)
// 	if err != nil {
// 		return uuid.Nil, "", fmt.Errorf("failed to retrieve company_id or email for ledgerID %s: %w", ledgerID, err)
// 	}
// 	return companyID, email, nil
// }


// const getPermitByID = async (id: string) => {
//   return await db.transaction().execute(async (trx) => {
//     const one = await trx.selectFrom(table).where('uuid', '=', id).select(['views_count', 'status']).executeTakeFirst();
//     if (!one) throw err.NotFound('Permit');

//     const currentViewsCount: number = one?.views_count ?? 0;
//     const currentStatus: number = one?.status ?? 0;

//     const newViewsCount: number = currentViewsCount + 1;
//     let newStatus: number = currentStatus;

//     if (newViewsCount > 0 && currentStatus === 1) newStatus = 2;


//     const updated = await trx.updateTable(table)
//       .where('uuid', '=', id)
//       .set({
//         'views_count': newViewsCount,
//         'status': newStatus,
//       })
//       .executeTakeFirst();
//     if (!updated) throw err.InternalServerError('Update error');


//     const permit = await trx
//       .selectFrom(table)
//       .selectAll(table)
//       .where('uuid', '=', id)
//       .select((eb) => [
//         clientIndividual(eb),
//         clientLegal(eb),
//         driver(eb),
//         transport(eb),
//         users(eb)
//       ])
//       .execute();

//     if (!permit) throw err.InternalServerError();

//     return permit

//   });
// };


export const permitRepo = {
  getLastPermitUser,
  findOne,
  edit,
  create,
  createPermit,
  getAllPermits,
  getAllRejectedPermits,
  getPermit,
  getOne,
  getOneForEmail,

  getExpiredPermits
};