import { z } from 'zod';
import { strInt } from './common';

export const authorities = z.object({
    public_api_uri: z.string(),
    code: z.string(),
    name: z.string(),

    permit_year: strInt,
    permit_type: strInt,
    quantity: strInt,
});

export const authoritiesCreate = authorities.pick({
    public_api_uri: true,
    code: true,
    name: true,
});

export const authoritiesQuotaCreate = authorities.pick({
    permit_year: true,
    permit_type: true,
    quantity: true,
});

export type Authorities = z.infer<typeof authorities>;
export type AuthoritiesCreate = z.infer<typeof authoritiesCreate>;
export type AuthoritiesQuotaCreate = z.infer<typeof authoritiesQuotaCreate>;

export const authoritiesSchema = {
    schema: authorities,
    authoritiesCreate,
    authoritiesQuotaCreate
};

export type AuthoritiesSchema = {
    Schema: Authorities;
    AuthoritiesCreate: AuthoritiesCreate;
    AuthoritiesQuotaCreate: AuthoritiesQuotaCreate;
};