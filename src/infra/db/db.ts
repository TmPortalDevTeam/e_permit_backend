import { getEnv } from '@infra/env/service';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB as Database } from './types';

const connectionString = getEnv('DATABASE_URL');

const dialect = new PostgresDialect({
    pool: new Pool({ connectionString, max: 10 }),
});

export type DB = Database;
// & {
//     roles: Database['roles']
//     users: Database['users']
//     permits: Database['permit']
//     client_legals: Database['client_legal']
//     epermit_ledger_permits: Database['epermit_ledger_permits']
// };

export const db = new Kysely<DB>({ dialect, log: ['query'] });
