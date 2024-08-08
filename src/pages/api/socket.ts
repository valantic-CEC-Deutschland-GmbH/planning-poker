import DatabaseUser from '@/interfaces/user';
import { lucia } from '@/utils/auth';
import { createEstimation, getEstimationByRoomUserId, getEstimationsByRoomId, updateEstimation } from '@/utils/estimation';
import { getRoomById, getRoomByRoomIdAndOwnerId, updateRoom } from '@/utils/room';
import { getRoomUserByIds } from '@/utils/roomUser';
import { getUserById } from '@/utils/user';
import { NextApiRequest } from 'next';
import { Server, Socket } from 'socket.io';

let io: Server

const SocketHandler = async (req: NextApiRequest, res: any) => {
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
  
      addEstimation(socket, roomId, sessionId)
      showHideEstimations(socket, roomId)
      onDisconnect(socket, roomId, sessionId)
      sendEstimations(roomId)
    });
  }

  res.end();
};

const onDisconnect = async (socket: Socket, roomId: string, sessionId: string) => {
  socket.on('disconnect', async () => {
    const user = await isConnectedValid(sessionId, roomId)

    if (!user) {
      return;
    }

    socket.to(roomId).emit('disconnected', `${user.firstName} ${user.lastName} disconnected`)
  });
}

const addEstimation = async (socket: Socket, roomId: string, sessionId: string) => {
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

    sendEstimations(roomId)
  });
}

const showHideEstimations = async (socket: Socket, roomId: string) => {
  socket.on('show-estimations', async (msg: string) => {
    const data = JSON.parse(msg)

    if (!data.id) return
    if (data.status !== 0 && data.status !== 1) return

    //TODO only id and status
    await updateRoom({ id: data.id, name: '', ownerId: 0, status: data.status })

    socket.emit('show-estimations', `${data.status}`)

    sendEstimations(roomId)
  })
}

const isConnectedValid = async (sessionId: string, roomId: string): Promise<DatabaseUser | undefined> => {
  const user = await getUser(sessionId);
  if (!user || !user.id) return undefined;

  const roomUser = await getRoomUserByIds(roomId, user.id)
  if (!roomUser) {
    const room = await getRoomByRoomIdAndOwnerId(roomId, user.id)

    if (!room) {
      return undefined
    }
  }

  return user
}

const sendEstimations = async (roomId: string) => {
    const room = await getRoomById(roomId)
    if (!room) return

    const estimations = await getEstimationsByRoomId(roomId)

    if (room.status !== 1) {
      estimations.forEach(estimation => {estimation.time = 0})
    }

    io.in(roomId).emit('estimations', JSON.stringify(estimations))
}

const getUser = async (sessionId: string): Promise<DatabaseUser | undefined> => {
  if (!sessionId) {
    return undefined;
  }

  const { user, session } = await lucia.validateSession(sessionId);

  if (!session || (session && session.fresh)) {
    return undefined
  }

  return await getUserById(user.id)
};

export default SocketHandler;
