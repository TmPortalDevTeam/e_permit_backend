import { z } from 'zod';
import { commonQuery, sortDirection } from './common';

export const RoleEnum = z.enum(['superadmin', 'bugalter', 'merkezi_gozegçi', 'post_gozegçi']);
export type Roles = z.infer<typeof RoleEnum>;
export const role = z.object({
  uuid: z.string().uuid(),
  name: z.string().nullable(),
});

export const roleGetAllRes = z.object({
  count: z.number(),
  data: role.array(),
});

export const admin = z.object({
  uuid: z.string().uuid(),
  password: z.string().min(4),
  username: z.string().min(4),
  password_name: z.string().nullable(),
  name: z.string().nullable(),
  role: z.string(),
  role_id: z.string().uuid(),
});

const adminSort = admin
  .pick({
    username: true,
    name: true,
    role: true
  })
  .keyof();

const sort = z
  .object({
    sortBy: adminSort.default('username'),
    sortDirection: sortDirection.default('desc'),
  })
  .partial();

export const adminGetAll = admin.extend({ text: z.string() }).partial().merge(sort).merge(commonQuery);
export const adminGetAllRes = z.object({
  count: z.number(),
  data: admin.omit({ password: true }).array(),
});


export const adminGetOneRes = admin
  .extend({ role_id: z.string().uuid().nullable() })
  .omit({ password: true, role: true });

export const adminCreate = admin
  .pick({
    username: true,
    password: true,
    password_name: true,
    name: true,
    role_id: true,
  });


export type Admin = z.infer<typeof admin>;
export type AdminGetAll = z.infer<typeof adminGetAll>;
export type AdminCreate = z.infer<typeof adminCreate>;
export type RoleGetAllRes = z.infer<typeof roleGetAllRes>;


export const adminSchema = {
  schema: admin,
  getRoles: roleGetAllRes,
  getAll: adminGetAll,
  getAllRes: adminGetAllRes,
  getOneRes: adminGetOneRes,
  create: adminCreate,
};

export type AdminSchema = {
  Schema: Admin;
  GetAll: AdminGetAll;
  Create: AdminCreate;
  GetRoles: RoleGetAllRes
};
