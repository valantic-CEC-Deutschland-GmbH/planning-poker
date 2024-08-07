import { NewRoomResponseInterface } from "@/interfaces/room";
import { createRoom } from "@/utils/room";
import { getUserById } from "@/utils/user";

export async function POST(request: Request) {
    const data = await request.json()

    console.log(data)

    let responseData: NewRoomResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    const name = data.name
    const ownerId = data.ownerId

    //TODO maybe check session to with lucia
    if (!ownerId || !await getUserById(ownerId)) {
        responseData.message = 'You are not authorized to create a room'
        return Response.json(responseData, { status: 401 })
    }

    if (!name) responseData.errors.push('Name is required')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, { status: 400 })
    }

    console.log({ id: undefined, name: name, ownerId: ownerId })

    responseData.message = await createRoom({ id: undefined, name: name, ownerId: ownerId })
    responseData.isSuccess = true

    return Response.json(responseData, { status: 200 })
}