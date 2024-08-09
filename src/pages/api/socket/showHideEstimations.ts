import { updateRoom } from "@/utils/room"
import { Server, Socket } from "socket.io"
import { broadcastEstimations } from "./broadcastEstimations"

export const showHideEstimations = async (io: Server,socket: Socket, roomId: string) => {
    socket.on('show-estimations', async (msg: string) => {
      const data = JSON.parse(msg)
  
      if (!data.id) return
      if (data.status !== 0 && data.status !== 1) return
  
      //TODO only id and status
      await updateRoom({ id: data.id, name: '', ownerId: 0, status: data.status })
  
      socket.emit('show-estimations', `${data.status}`)
  
      broadcastEstimations(io, roomId)
    })
  }