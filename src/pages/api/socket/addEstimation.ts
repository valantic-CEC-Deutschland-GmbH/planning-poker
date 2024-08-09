import { createEstimation, getEstimationByRoomUserId, updateEstimation } from "@/utils/estimation";
import { Server, Socket } from "socket.io";
import { isConnectedValid } from "./connectedUserValid";
import { broadcastEstimations } from "./broadcastEstimations";

export const addEstimation = async (io: Server, socket: Socket, roomId: string, sessionId: string) => {
    socket.on('add-estimation', async (msg: string) => {
        const user = await isConnectedValid(sessionId, roomId)

        if (!user) {
            return;
        }

        let data

        try {
            data = JSON.parse(msg)
        } catch {
            return
        }

        //maybe send roomUserId via query not ws so it cant be manipulated so easily
        if (!data?.roomUserId || !data?.estimation) {
            return
        }

        const estimation = await getEstimationByRoomUserId(data.roomUserId)

        if (estimation) {
            estimation.time = data.estimation
            await updateEstimation(estimation)
        } else {
            await createEstimation({
                roomUserId: data.roomUserId,
                time: data.estimation
            })
        }

        broadcastEstimations(io, roomId)
    });
}