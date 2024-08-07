import { db } from "../../db";
import { DatabaseRoomUser, DatabaseRoomUserWithUser } from "@/interfaces/roomUser";
import { roomUser } from "../../db/schema";
import { and, eq } from "drizzle-orm";

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

/**
 * 
 * @param roomId
 * @param user related user data
 * @param room related room data
 * @returns 
 */
export async function getRoomUsersByRoom(roomId: string, user: boolean = false, room: boolean = false): Promise<DatabaseRoomUserWithUser[]> {
    const result = db.query.roomUser.findMany({
        with: {
            ...(user && { user: true }),
            ...(room && { room: true }),
        },
        where: eq(roomUser.roomId, roomId),
    });
    return result;
}


export async function getRoomUserByIds(roomId: string, userId: number): Promise<DatabaseRoomUser | undefined> {
    const result = db.query.roomUser.findFirst({
        where: ((roomUser, { eq, and}) => and(eq(roomUser.roomId, roomId), eq(roomUser.userId, userId)))
    });

    return result;
}

export async function deleteRoomUser(id: number): Promise<DatabaseRoomUser[]> {
    return db.delete(roomUser).where(eq(roomUser.id, id)).returning();
}