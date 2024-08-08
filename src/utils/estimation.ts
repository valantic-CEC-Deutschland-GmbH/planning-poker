import { eq } from "drizzle-orm";
import { db } from "../../db";
import { estimation, roomUser } from "../../db/schema";
import { DatabaseEstimation } from "@/interfaces/estimation";

export async function getEstimationsByRoomId(id: string): Promise<DatabaseEstimation[]> {
    return db.query.estimation.findMany({
        with: {
            roomUser: {
                // @ts-ignore it works but shows it as error
                where: eq(roomUser.roomId, id),
                with: {
                    user: true
                }
            }
        }
    })
}

export async function getEstimationByRoomUserId(id: number): Promise<DatabaseEstimation | undefined> {
    return db.query.estimation.findFirst({
        where: eq(estimation.roomUserId, id)
    })
}

export async function createEstimation(newEstimation: DatabaseEstimation) {
    await db.insert(estimation).values({
        roomUserId: newEstimation.roomUserId,
        time: newEstimation.time
    });
}

export async function updateEstimation(updateEstimation: DatabaseEstimation) {
    if (!updateEstimation.id) return

    await db.update(estimation)
        .set({
            roomUserId: updateEstimation.roomUserId,
            time: updateEstimation.time
        })
        .where(eq(estimation.id, updateEstimation.id));
}