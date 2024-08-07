import { NewRoomResponseInterface } from "@/interfaces/room";
import { createRoomUser } from "@/utils/roomUser";

export async function POST(request: Request) {
    const data = await request.json()

    console.log(data)

    //TODO auth

    //TODO response always same structure rename
    let responseData: NewRoomResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    const roomId = data.roomId
    const userId = data.userId

    if (!roomId) responseData.errors.push('Room is required')
    if (!userId) responseData.errors.push('User is required')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, { status: 400 })
    }

    await createRoomUser({ roomId: roomId, userId: userId })
    
    responseData.isSuccess = true
    responseData.message = 'User was added to room'
    
    return Response.json(responseData, { status: 200 })
}