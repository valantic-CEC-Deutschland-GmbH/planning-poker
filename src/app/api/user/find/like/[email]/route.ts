import { getUsersBySimilarEmail } from "@/utils/user";

export async function GET(request: Request, { params }: { params: { email: string } }) {
    const users = await getUsersBySimilarEmail(params.email)
    return Response.json(users, { status: 200 })
}