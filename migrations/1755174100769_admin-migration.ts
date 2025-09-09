import { sql, type Kysely } from 'kysely';

const table = 'payment';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(table)
    .addColumn('type', 'varchar')
    .addColumn('pay_date', 'timestamptz')
    .addColumn('document_number', 'varchar')
    .addColumn('filename', 'varchar')
    .addColumn('createdAt', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute();
}
