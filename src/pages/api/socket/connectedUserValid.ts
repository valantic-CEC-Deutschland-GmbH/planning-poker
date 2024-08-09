import DatabaseUser from "@/interfaces/user";
import { lucia } from "@/utils/auth";
import { getRoomByRoomIdAndOwnerId } from "@/utils/room";
import { getRoomUserByIds } from "@/utils/roomUser";
import { getUserById } from "@/utils/user";

export const isConnectedValid = async (sessionId: string, roomId: string): Promise<DatabaseUser | undefined> => {
    if (!sessionId) {
        return undefined;
    }

    const { user, session } = await lucia.validateSession(sessionId);

    if (!session || (session && session.fresh)) {
        return undefined
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser?.id) return undefined;

    const roomUser = await getRoomUserByIds(roomId, dbUser.id)

    if (!roomUser) {
        const room = await getRoomByRoomIdAndOwnerId(roomId, dbUser.id)

        if (!room) {
            return undefined
        }
    }

    return dbUser
}