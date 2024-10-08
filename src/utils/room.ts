import DatabaseRoom from "@/interfaces/room";
import { room } from "../../db/schema";
import { db } from "../../db";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";

/**
 * creates a new room and returns the uuid of the room
 * 
 * @param newRoom 
 * @returns
 */
export async function createRoom(newRoom: DatabaseRoom): Promise<string> {
    const uuid = uuidv4()

    await db.insert(room).values({
        id: uuid,
        name: newRoom.name,
        ownerId: newRoom.ownerId,
        status: 0
    });

    return uuid
}

export async function getRoomsByOwnerId(id: number): Promise<DatabaseRoom[]> {
    return db.query.room.findMany({ where: eq(room.ownerId, id) });
}

export async function getRoomByRoomIdAndOwnerId(id: string, ownerId: number): Promise<DatabaseRoom | undefined> {
    return db.query.room.findFirst({
        where: ((room, { eq, and }) => and(eq(room.id, id), eq(room.ownerId, ownerId)))
    });
}

export async function getRoomById(id: string) {
    return db.query.room.findFirst({
        where: eq(room.id, id)
    });
}

export async function updateRoom(updateRoom: DatabaseRoom) {
    if (!updateRoom.id) return

    await db.update(room)
        .set({
            status: updateRoom.status,
        })
        .where(eq(room.id, updateRoom.id));
}