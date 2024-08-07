import { NewRoomResponseInterface } from "@/interfaces/room";
import { getRoomUsersByRoom, createRoomUser, getRoomUserByIds, deleteRoomUser } from "@/utils/roomUser";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const roomId = request.nextUrl.searchParams.get('roomId')
    const user = request.nextUrl.searchParams.get('user') === '1' ? true : false
    const room = request.nextUrl.searchParams.get('room') === '1' ? true : false

    if (roomId) {
        const users = await getRoomUsersByRoom(roomId, user, room)
        return Response.json(users, { status: 200 })
    }

    return Response.json(null, { status: 422 })
}

export async function POST(request: NextRequest) {
    const data = await request.json()

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

    if (await getRoomUserByIds(roomId, userId)) {
        responseData.message = 'User was already added'
        return Response.json(responseData, { status: 400 })
    }

    await createRoomUser({ roomId: roomId, userId: userId })

    responseData.isSuccess = true
    responseData.message = 'User was added to room'

    return Response.json(responseData, { status: 200 })
}

export async function DELETE(request: NextRequest) {
    const data = await request.json()
    const id = data.id

    console.log(id)

    //TODO response always same structure rename
    let responseData: NewRoomResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    if (!id) responseData.errors.push('Id is required')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, { status: 400 })
    }

    const deletedUsers = await deleteRoomUser(id)

    console.log(deletedUsers , deletedUsers.length)

    if (deletedUsers.length > 0) {
        responseData.isSuccess = true
        responseData.message = 'User was removed from room'
        return Response.json(responseData, { status: 200 })
    }

    responseData.message = 'User couldn\'t be removed from room'
        return Response.json(responseData, { status: 400 })
}