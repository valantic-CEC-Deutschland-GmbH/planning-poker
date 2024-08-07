import { uuid } from "drizzle-orm/pg-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
});

export const session = sqliteTable("session", {
    id: text("id").notNull().primaryKey(),
    userId: integer("user_id").notNull().references(() => user.id),
    expiresAt: integer("expires_at").notNull()
});

export const room = sqliteTable("room", {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    ownerId: integer("user_id").notNull().references(() => user.id),
});