import {lucia} from "@/utils/auth";
import {cookies} from "next/headers";
import {cache} from 'react'
import DatabaseUser from "@/interfaces/user";
import {db} from "../../db";
import {user} from "../../db/schema";
import {eq} from "drizzle-orm";

export const getUser = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) return null;
    
    const {user, session} = await lucia.validateSession(sessionId);
    try {
        //Session but not fresh (true = not fesh and has to be refreshed)
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
});

export async function getUserByEmail(email: string): Promise<DatabaseUser | undefined> {
    return db.query.user.findFirst({where: eq(user.email, email)});
}

export async function createUser(newUser: DatabaseUser) {
    await db.insert(user).values({
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
    });
}