import { createRoomUser, getRoomUsersByRoom } from "@/utils/roomUser";

export async function GET(request: Request, { params }: { params: { roomId: string } }) {
    const users = await getRoomUsersByRoom(params.roomId)

    console.error(users)

    return Response.json(users, { status: 200 })
}