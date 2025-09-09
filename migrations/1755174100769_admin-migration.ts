import { sql, type Kysely } from 'kysely';

const table = 'admins';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable(table)
    .addColumn('document_number', 'varchar')
    .addColumn('filename', 'varchar')
    .addColumn('payDate', 'timestamptz')
    .addColumn('createdAt', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute();
}
