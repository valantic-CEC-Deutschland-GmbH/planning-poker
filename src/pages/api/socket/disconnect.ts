import { Socket } from "socket.io";
import { isConnectedValid } from "./connectedUserValid";

export const onDisconnect = async (socket: Socket, roomId: string, sessionId: string) => {
    socket.on('disconnect', async () => {
      const user = await isConnectedValid(sessionId, roomId)
  
      if (!user) {
        return;
      }
  
      socket.to(roomId).emit('disconnected', `${user.firstName} ${user.lastName} disconnected`)
    });
  }