import { Lucia } from "lucia";
import {DrizzleSQLiteAdapter} from "@lucia-auth/adapter-drizzle";
import {session, user} from "../../db/schema";
import {db} from "../../db";

import DatabaseUser from "@/interfaces/user";

const adapter = new DrizzleSQLiteAdapter(db, session, user);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
        };
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
        UserId: number;
    }
}