import DatabaseUser from '@/interfaces/user';
import { lucia } from '@/utils/auth';
import { getRoomByRoomIdAndOwnerId } from '@/utils/room';
import { getRoomUserByIds } from '@/utils/roomUser';
import { getUserById } from '@/utils/user';
import { NextApiRequest } from 'next';
import { Server } from 'socket.io';

const SocketHandler = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    res.socket.server.io = new Server(res.socket.server);

    res.socket.server.io.on('connection', async (socket: any) => {
      const roomId = socket.handshake.query.roomId;
      const sessionId = socket.handshake.auth.token

      const user = await isConnectedValid(sessionId, roomId)
      if (!user) {
        return;
      }

      socket.join(roomId);
      socket.to(roomId).emit('connected', `User ${user.firstName} ${user.lastName} connected`)

      socket.on('input', async (msg: string) => {
        const user = await isConnectedValid(sessionId, roomId)

        if (!user) {
          return;
        }

        socket.to(roomId).emit('update', msg)
      });

      socket.on('disconnect', async () => {
        const user = await isConnectedValid(sessionId, roomId)

        if (!user) {
          return;
        }

        socket.to(roomId).emit('disconnected', `User ${user.firstName} ${user.lastName} disconnected`)
      });
    });
  }

  res.end();
};

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
