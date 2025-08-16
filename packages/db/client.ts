// client.ts
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { DB } from "./prisma/types";

const { Pool } = pg;
let _db: Kysely<DB> | undefined;

export function getDb() {
  if (_db) return _db;
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }, // needed for Supabase
  });
  _db = new Kysely<DB>({ dialect: new PostgresDialect({ pool }) });
  return _db;
}

export const db = getDb();
