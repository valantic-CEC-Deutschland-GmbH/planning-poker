import { relations } from "drizzle-orm";
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
    status: integer("status").notNull(),
});

export const roomUser = sqliteTable("room_user", {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    roomId: text("room_id").notNull().references(() => room.id),
    userId: integer("user_id").notNull().references(() => user.id),
});

export const estimation = sqliteTable("estimation", {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    roomUserId: integer("room_user_id").notNull().references(() => roomUser.id),
    time: integer("time").notNull()
});

//Relations
export const roomUserRelations = relations(roomUser, ({ one }) => ({
    user: one(user, {
        fields: [roomUser.userId],
        references: [user.id],
    }),
    room: one(room, {
        fields: [roomUser.roomId],
        references: [room.id],
    }),
    estimation: one(estimation),
}));

export const estimationRelations = relations(estimation, ({ one }) => ({
    roomUser: one(roomUser, {
      fields: [estimation.roomUserId],
      references: [roomUser.id],
    }),
  }));