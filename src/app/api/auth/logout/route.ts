import { lucia } from "@/utils/auth";
import {cookies} from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
        redirect('/login')
    }

    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    redirect('/login')
}
