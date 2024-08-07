import { getUsersBySimilarEmail } from "@/utils/user";
import { NextRequest } from "next/server";
import { AuthResponseInterface } from "@/interfaces/auth";
import {createUser, getUserByEmail} from "@/utils/user";
import {Argon2id} from "oslo/password";

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
    const like = request.nextUrl.searchParams.get('like')

    if (like) {
        const users = await getUsersBySimilarEmail(like)
        return Response.json(users, { status: 200 })
    }
    
    return Response.json(null, { status: 422 })
}

export async function POST(request: Request) {
    const data = await request.json()

    let responseData: AuthResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    const email = data.email
    const plainPassword = data.password
    const firstName = data.firstName
    const lastName = data.lastName
    const domain = process.env.EMAIL_DOMAIN;
    const pattern = new RegExp(`^[a-zA-Z0-9._%+-]+@${domain?.replace('.', '\\.')}$`);

    if (!email) responseData.errors.push('Email is not provided')
    if (!plainPassword) responseData.errors.push('Password is not provided')
    if (!firstName) responseData.errors.push('First name is not provided')
    if (!lastName) responseData.errors.push('Last name is not provided')
    if (!pattern.test(email)) responseData.errors.push('Email domain is not allowed')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, {status: 400})
    }

    const checkUser = await getUserByEmail(data.email);

    if(checkUser) {
        responseData.errors.push('User already exists')
        return Response.json(responseData, {status: 400})
    }

    try {
        const password = await new Argon2id().hash(plainPassword);
        await createUser({ email, password, firstName, lastName})

        responseData.isSuccess = true
        responseData.message = 'Your account was created successfully'

        return Response.json(responseData, {status: 200})
    }

    catch (error) {
        responseData.errors.push('Something went wrong')
        return Response.json(responseData, {status: 500})
    }
}