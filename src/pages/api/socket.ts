import { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import { addEstimation } from './socket/addEstimation';
import { showHideEstimations } from './socket/showHideEstimations';
import { onDisconnect } from './socket/disconnect';
import { broadcastEstimations } from './socket/broadcastEstimations';
import { isConnectedValid } from './socket/connectedUserValid';

let io: Server

export const SocketHandler = async (req: NextApiRequest, res: any) => {
  if (!io || !res.socket.server.io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io

    io.on('connection', async (socket: any) => {
      const roomId = socket.handshake.query.roomId;
      const sessionId = socket.handshake.auth.token
  
      const user = await isConnectedValid(sessionId, roomId)
      if (!user) {
        return;
      }
  
      socket.join(roomId);
      socket.to(roomId).emit('connected', `${user.firstName} ${user.lastName} connected`)
  
      addEstimation(io, socket, roomId, sessionId)
      showHideEstimations(io, socket, roomId)
      onDisconnect(socket, roomId, sessionId)
      broadcastEstimations(io, roomId)
    });
  }

  res.end();
};

export default SocketHandler;
