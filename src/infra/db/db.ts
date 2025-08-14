import { AcademySchema } from '@api/schema/academy';
import { InfoSchema } from '@api/schema/info';
import { LessonSchema } from '@api/schema/lesson';
import { User } from '@api/schema/user';
import { UserAbsenceSchema } from '@api/schema/user-absence';
import { getEnv } from '@infra/env/service';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB as Database } from './types';

const connectionString = getEnv('DATABASE_URL');

const dialect = new PostgresDialect({
  pool: new Pool({ connectionString, max: 10 }),
});

export type DB = Database & {
  users: Database['users'] & { role: User['role'] };
  academies: Database['academies'] & { type: AcademySchema['Schema']['type'] };
  lessons: Database['lessons'] & { type: LessonSchema['Schema']['type'] };
  user_absence: Database['user_absence'] & { type: UserAbsenceSchema['Schema']['type'] };
  info: Database['info'] & { code: InfoSchema['Schema']['code'] };
};

export const db = new Kysely<DB>({ dialect, log: ['query'] });
