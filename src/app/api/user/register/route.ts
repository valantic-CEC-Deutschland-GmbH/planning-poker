import {createUser, getUserByEmail} from "@/utils/user";
import {Argon2id} from "oslo/password";

export async function POST(request: Request) {
    const data = await request.json()
    const missingFields = [];

    const email = data.email
    const plainPassword = data.password
    const firstName = data.firstName
    const lastName = data.lastName

    if (!email) missingFields.push('email')
    if (!plainPassword) missingFields.push('password')
    if (!firstName) missingFields.push('firstName')
    if (!lastName) missingFields.push('lastName')



    if (missingFields.length > 0) {
        return Response.json({'error': `Missing fields: ${missingFields.join(', ')}`}, {status: 400})
    }

    const checkUser = await getUserByEmail(data.email);

    if(checkUser) {
        return Response.json({'error': 'User already exists'}, {status: 400})
    }

    try {
        const password = await new Argon2id().hash(plainPassword);
        await createUser({ email, password, firstName, lastName})

        return Response.json({ 'message': 'ok' })
    }

    catch (error) {
        return Response.json({'error': 'Something went wrong'}, {status: 500})
    }
}