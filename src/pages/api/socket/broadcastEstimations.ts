import { getEstimationsByRoomId } from "@/utils/estimation"
import { getRoomById } from "@/utils/room"
import { Server } from "socket.io"

export const broadcastEstimations = async (io: Server, roomId: string) => {
    const room = await getRoomById(roomId)
    if (!room) return

    const estimations = await getEstimationsByRoomId(roomId)

    if (room.status !== 1) {
      estimations.forEach(estimation => {estimation.time = 0})
    }

    io.in(roomId).emit('estimations', JSON.stringify(estimations))
}