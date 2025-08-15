import { sql, type Kysely } from 'kysely';

const table = 'roles';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(table)
    .ifNotExists()
    .addColumn('uuid', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'varchar(255)', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(table).ifExists().execute();
}
