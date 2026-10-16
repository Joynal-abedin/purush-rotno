import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';

export const getDb = (d1Binding: D1Database) => {
  return drizzle(d1Binding, { schema });
};
