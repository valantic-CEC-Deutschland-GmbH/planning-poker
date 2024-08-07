import {drizzle} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL);
export const db = drizzle(sqlite, {schema});

migrate(db, {migrationsFolder: process.env.DATABASE_OUT ?? ''});