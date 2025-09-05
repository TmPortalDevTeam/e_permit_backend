import { z } from 'zod';
import { strBool, strInt } from './common';

export const getAllPermitsExternalApi = z.object({
  issuer: z.string(),
  issuedFor: z.string(),
  permitYear: strInt,
  permitType: strInt,
  used: strBool,
  revoked: strBool,
  issuedAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),
}).partial();
export type GetAllPermitsExternalApi = z.infer<typeof getAllPermitsExternalApi>;

export const permitSchemaExternalApi = {
  getAllPermitsExternalApi
};

export type PermitSchemaExternalApi = {
  GetAllPermitsExternalApi: GetAllPermitsExternalApi;
};