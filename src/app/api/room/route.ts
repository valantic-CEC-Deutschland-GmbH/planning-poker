import { NewRoomResponseInterface } from "@/interfaces/room";
import { createRoom, getRoomById, updateRoom } from "@/utils/room";
import { getUserById } from "@/utils/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const roomId = request.nextUrl.searchParams.get('roomId')

    if (roomId) {
        const room = await getRoomById(roomId)
        return Response.json(room, { status: 200 })
    }

    return Response.json(null, { status: 422 })
}

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

    responseData.message = await createRoom({ id: undefined, name: name, ownerId: ownerId, status: 0 })
    responseData.isSuccess = true

    return Response.json(responseData, { status: 200 })
}

export async function PUT(request: Request) {
    const data = await request.json()

    console.log(data)

    let responseData: NewRoomResponseInterface = {
        errors: [],
        message: undefined,
        isSuccess: false
    }

    const id = data.id
    const name = data.name
    const ownerId = data.ownerId
    const status = data.status

    if (!id) responseData.errors.push('Name is required')
    if (!name) responseData.errors.push('Name is required')
    if (!ownerId) responseData.errors.push('Owner is required')
    if (status !== 0 && status !== 1) responseData.errors.push('Status must be 0 or 1')

    if (responseData.errors.length > 0) {
        return Response.json(responseData, { status: 400 })
    }

    //TODO check if user is allowed to change data

    await updateRoom({ id: id, name: name, ownerId: ownerId, status: status })
    responseData.message = status === 1 ? 'Show estimations' : 'Hide estimations'
    responseData.isSuccess = true

    return Response.json(responseData, { status: 200 })
}