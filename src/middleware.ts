import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./utils/user";

export async function middleware(request: NextRequest): Promise<NextResponse> {
    console.log(request.url)

    if (request.method === "GET") {
        return NextResponse.next();
    }

    const originHeader = request.headers.get("Origin");
    const hostHeader = request.headers.get("Host") ?? request.headers.get("X-Forwarded-Host");

    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
        return new NextResponse(null, {status: 403});
    }

    return NextResponse.next();
}

//Skip static and public files
export const config = { matcher: '/((?!.*\\.).*)' }