import { getEnv } from '@infra/env/service';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB as Database } from './types';

const connectionString = getEnv('DATABASE_URL');

const dialect = new PostgresDialect({
    pool: new Pool({ connectionString, max: 10 }),
});

export type DB = Database;

export const db = new Kysely<DB>({ dialect, log: ['query'] });