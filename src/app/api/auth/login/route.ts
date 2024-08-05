import {getUserByEmail} from "@/utils/user";
import {Argon2id} from "oslo/password";
import {lucia} from "@/utils/auth";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const data = await request.json()

    if (!data.email || !data.password) {
        return Response.json({'error': 'Invalid credentials'}, {status: 401})
    }

    const existingUser = await getUserByEmail(data.email);

    if(!existingUser || !existingUser.id) {
        return Response.json({'error': 'Invalid credentials'}, {status: 401})
    }

    const validPassword = await new Argon2id().verify(existingUser.password, data.password);

    if (!validPassword) {
        return Response.json({'error': 'Invalid credentials'}, {status: 401})
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return Response.json({ 'message': 'ok' })
}