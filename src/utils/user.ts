import DatabaseUser from "@/interfaces/user";
import {db} from "../../db";
import {user} from "../../db/schema";
import {eq, like} from "drizzle-orm";

export async function getUserByEmail(email: string): Promise<DatabaseUser | undefined> {
    return db.query.user.findFirst({where: eq(user.email, email)});
}

export async function getUserById(id: number): Promise<DatabaseUser | undefined> {
    return db.query.user.findFirst({where: eq(user.id, id)});
}

export async function getUsersBySimilarEmail(email: string): Promise<DatabaseUser[]> {
    return db.query.user.findMany({where: like(user.email, `%${email}%`)});
}

export async function createUser(newUser: DatabaseUser) {
    await db.insert(user).values({
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
    });
}