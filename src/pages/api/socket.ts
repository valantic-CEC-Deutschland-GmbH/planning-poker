import { lucia } from '@/utils/auth';
import { User } from 'lucia';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

const SocketHandler = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    res.socket.server.io = new Server(res.socket.server);

    res.socket.server.io.on('connection', (socket: any) => {
      socket.join(socket.handshake.query.roomId);

      console.log(`a user connected to room: ${socket.handshake.query.roomId}`)
  
      socket.on('input-change', async (msg: string) => {
        const user = await getUser(socket.handshake.auth.token, res);
        console.log(`${user?.email} changed input`)
  
        if (user) {
          console.log(`User ${user.email} connected`);
          socket.to(socket.handshake.query.roomId).emit('update-input', msg)
        }
      });
  
      socket.on('disconnect', () => {
        console.log('disconnected');
      });
    });
  }

  res.end();
};

const getUser = async (sessionId: string, res: any): Promise<User | null> => {
  if (!sessionId) {
    return null;
  }

  const { user, session } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.setHeader('Set-Cookie', sessionCookie);
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    res.setHeader('Set-Cookie', sessionCookie);
  }

  return user
};

export default SocketHandler;
