import { z } from 'zod';
import { strBool, strInt } from './common';

export const schema = z.object({
  issuer: z.string(),
  issuedFor: z.string(),
  permitYear: strInt,
  permitType: strInt,
  used: strBool,
  revoked: strBool,
  issuedAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),

  permitId: z.string(),
  companyId: z.string(),
  plateNumber: z.string(),
  // plateNumber2 remove JAVA API Swagger
  createdAt: z.string(),
  page: strInt

}).partial();


export const getPermitsExternalApi = schema.pick({
  issuer: true,
  issuedFor: true,
  permitYear: true,
  permitType: true,

  permitId: true,
  companyId: true,
  plateNumber: true,
  issuedAt: true,
  createdAt: true,
  startDate: true,
  endDate: true,
  page: true
}).partial();

export const getAllPermitsExternalApi = schema.pick({
  issuer: true,
  issuedFor: true,
  permitYear: true,
  permitType: true,
  used: true,
  revoked: true,
  issuedAt: true,
  startDate: true,
  endDate: true,
}).partial();

export type GetPermitsExternalApi = z.infer<typeof getPermitsExternalApi>;
export type GetAllPermitsExternalApi = z.infer<typeof getAllPermitsExternalApi>;


export const permitSchemaExternalApi = {
  getPermitsExternalApi,
  getAllPermitsExternalApi
};

export type PermitSchemaExternalApi = {
  GetPermitsExternalApi: GetPermitsExternalApi,
  GetAllPermitsExternalApi: GetAllPermitsExternalApi;
};