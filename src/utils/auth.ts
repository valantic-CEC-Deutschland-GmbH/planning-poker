import { Lucia } from "lucia";
import {DrizzleSQLiteAdapter} from "@lucia-auth/adapter-drizzle";
import {session, user} from "../../db/schema";
import {db} from "../../db";

import DatabaseUser from "@/interfaces/user";
import { cookies } from "next/headers";

const adapter = new DrizzleSQLiteAdapter(db, session, user);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
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

//TODO currently getting error - We recommend wrapping the function with cache() so it can be called multiple times without incurring multiple database calls.
export const getUser = async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) return null;
    
    const {user, session} = await lucia.validateSession(sessionId);
    try {
        //Session but not fresh (true = not fresh and has to be refreshed)
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
    }

    return user;
};