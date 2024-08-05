import {getUserByEmail} from "@/utils/user";
import {Argon2id} from "oslo/password";
import {lucia} from "@/utils/auth";
import {cookies} from "next/headers";
import { AuthResponseInterface } from "@/interfaces/auth";

export async function POST(request: Request) {
    const data = await request.json()

    let responseData: AuthResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    const email = data.email
    const password = data.password

    if (!email) responseData.errors.push('Email not provided')
    if (!password) responseData.errors.push('Password not provided')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, {status: 401})
    }

    const existingUser = await getUserByEmail(data.email);

    if(!existingUser || !existingUser.id) {
        responseData.message = 'Invalid credentials'
        return Response.json(responseData, {status: 401})
    }

    const validPassword = await new Argon2id().verify(existingUser.password, data.password);

    if (!validPassword) {
        responseData.message = 'Invalid credentials'
        return Response.json(responseData, {status: 401})
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    responseData.message = 'Logged in'
    responseData.isSuccess = true
    return Response.json(responseData, {status: 200})
}