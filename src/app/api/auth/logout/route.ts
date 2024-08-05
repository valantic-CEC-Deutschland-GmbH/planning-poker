import { lucia } from "@/utils/auth";
import {cookies} from "next/headers";

export async function GET(request: Request, server) {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
        return Response.json({}, {status: 401})
    }

    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return Response.json({}, {status: 200})
}
