import { sql, type Kysely } from 'kysely';

const table = 'admins';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(table)
    .ifNotExists()
    .addColumn('uuid', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('username', 'varchar(200)', (c) => c.notNull().unique())
    .addColumn('password', 'varchar(100)', (c) => c.notNull())
    .addColumn('password_name', 'varchar(100)')
    .addColumn('name', 'varchar(255)')
    .addColumn('role_id', 'uuid', (c) => c.references('roles.uuid').onUpdate('cascade').onDelete('set null'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(table).ifExists().execute();
}
