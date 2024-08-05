import {drizzle, BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

const sqlite = new Database("./db/database.db");
export const db = drizzle(sqlite, {schema});

migrate(db, {migrationsFolder: "./db/migrations"});