import { db } from './db';

export const connectCheck = async () => {
  await db.connection().execute(async db => { });
  console.log('db connected');
};
