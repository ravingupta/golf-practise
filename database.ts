import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Shot from './model/Shot';
import { shotSchema } from './model/shotSchema';

const adapter = new SQLiteAdapter({
  schema: shotSchema,
});

export const database = new Database({
  adapter,
  modelClasses: [Shot],
});
