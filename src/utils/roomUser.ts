import { db } from "../../db";
import { DatabaseRoomUser, DatabaseRoomUserWithUser } from "@/interfaces/roomUser";
import { roomUser } from "../../db/schema";
import { eq } from "drizzle-orm";

/**
 * creates a new room and returns the uuid of the room
 * 
 * @param newRoom 
 * @returns
 */
export async function createRoomUser(newRoomUser: DatabaseRoomUser) {
    await db.insert(roomUser).values({
        roomId: newRoomUser.roomId,
        userId: newRoomUser.userId,
    });
}

export async function getRoomUsersByRoom(roomId: string): Promise<DatabaseRoomUserWithUser[]> {
    const result = db.query.roomUser.findMany({
        with: {
            user: true,
        },
        where: eq(roomUser.roomId, roomId),
    });
    return result;
}