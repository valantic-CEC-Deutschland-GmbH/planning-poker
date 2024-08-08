import Chat from "@/components/ws/chat";
import { getUser, lucia } from "@/utils/auth";
import { getRoomById } from "@/utils/room";
import { getRoomUserByIds } from "@/utils/roomUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Room({ params }: { params: { id: string } }) {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? '';

    const room = await getRoomById(params.id)

    if (!room) {
        redirect('/')
    }

    const roomUser = await getRoomUserByIds(room.id, user.id)

    if (!roomUser?.id) {
        redirect('/')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl">Room: {room.name}</h1>
            </div>
            
            <Chat params={{sessionId: sessionId, userId: user.id, room: room, roomUserId: roomUser.id}} />
        </div>
    )
}