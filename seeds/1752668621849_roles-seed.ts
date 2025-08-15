import type { Kysely } from 'kysely';

export async function seed(db: Kysely<any>): Promise<void> {
  const insertedRole = await db
    .insertInto('roles')
    .values([{ name: 'superadmin' }])
    .returning('uuid')
    .executeTakeFirstOrThrow();

  await db
    .insertInto('admins')
    .values([{
      username: 'admin',
      password: '$2b$10$H/IqprcqH6IyXX1KdLdhkuQncJLD96/zqpaH/jITKwXLwEuTamwKu',
      password_name: 'ad',
      name: 'hekim',
      role_id: insertedRole.uuid
    }])
    .execute();


  await db
    .insertInto('roles')
    .values([
      { name: 'bugalter' },
      { name: 'merkezi_gozegçi' },
      { name: 'post_gozegçi' },
    ])
    .returning('uuid')
    .executeTakeFirstOrThrow();

}