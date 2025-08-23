import { z } from 'zod';
import { commonQuery, strBool } from './common';

export const permit = z.object({
  uuid: z.string().uuid(),
  country: z.string(),
  transit_country: z.string(),
  type_of_cargo: z.string(),
  departure_date: z.string(),
  return_date: z.string(),
  phone: z.string(),
  email: z.string().email(),
  city: z.string(),
  region: z.string(),
  license_number: z.string(),
  license_expire_date: z.string(),
  license_categories: z.string().array(),
  licenses: z.string().array(),
  license_types: z.string().array().nullable(),
  container_number: z.number().int(),
  is_legal: strBool,
  // status: z.number().int(),
  issued_for: z.string(),
  permit_type: z.number().int(),
  auth_id: z.string().uuid(),

  driver_name: z.string(),
  driver_surname: z.string(),
  driver_patronymic: z.string(),
  driving_license_number: z.string(),
  driving_license_expire_date: z.string(),

  // transport
  brand: z.string().array(),
  type: z.number().int().array(),
  card_number: z.string().array(),
  card_start_date: z.string().array(),
  card_expire_date: z.string().array(),
  plate_number: z.string().array(),
  foreign_plate_number: z.string().array(),

  individual_name: z.string(),
  individual_surname: z.string(),
  individual_patronymic: z.string(),
  individual_patent_number: z.string(),
  individual_patent_expire_date: z.string(),

  legal_company_name: z.string(),
  legal_address: z.string(),
  legal_yegrpo_number: z.string(),
  legal_yegrpo_expire_date: z.string(),
  legal_certificate_number: z.string(),
  legal_bank_details: z.string(),
  legal_account_number: z.string(),
  legal_number_of_cars: z.number().int(),
});

export const permitCreate = permit.omit({ uuid: true })
export const permitGetOneRes = z.object({ data: z.string() });

export const userGetOneRes = permit;
export const permitGetAll = permit.extend({ text: z.string() }).partial().merge(commonQuery);
export const permitGetAllRes = z.object({
  count: z.number(),
  data: permit.pick({
    uuid: true,
    is_legal: true,
    country: true,
    type_of_cargo: true,
    email: true,
    phone: true,
    license_number: true,
  }).array(),
});

export const getAllRejectedPermit = z.object({ text: z.string() }).partial().merge(commonQuery);

export const updatePermitStatusSchema = z.object({
  permitId: z.string().uuid(),
  status: z.number().int().default(0).optional(),
});

export const updatePermitStatus7Schema = updatePermitStatusSchema
  .pick({ permitId: true })
  .extend({
    status: z.number().int(),
    body: z.string(),
  })


export type Permit = z.infer<typeof permit>;
export type PermitGetAll = z.infer<typeof permitGetAll>;
export type PemritCreate = z.infer<typeof permitCreate>;
export type GetAllRejectedPermit = z.infer<typeof getAllRejectedPermit>;
export type UpdatePermitStatus7 = z.infer<typeof updatePermitStatus7Schema>;

export const permitSchema = {
  schema: permit,
  getAll: permitGetAll,
  getAllRes: permitGetAllRes,
  getOneRes: userGetOneRes,
  create: permitCreate,
  getAllRejectedPermit,
  updatePermitStatusSchema,
  updatePermitStatus7Schema
};

export type PermitSchema = {
  Schema: Permit;
  GetAll: PermitGetAll;
  Create: PemritCreate;
  GetAllRejectedPermit: GetAllRejectedPermit;
  UpdatePermitStatus7: UpdatePermitStatus7;
};