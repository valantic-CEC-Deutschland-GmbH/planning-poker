import { lucia } from '@/utils/auth';
import { User } from 'lucia';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

const SocketHandler = async (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    res.socket.server.io = new Server(res.socket.server);

    res.socket.server.io.on('connection', (socket: any) => {
      console.log('a user connected')
  
      socket.on('input-change', async (msg: string) => {
        //TODO user donst update when loggin in works when outside if but then i get error to many handlers
        const user = await getUser(req, res);
        console.log(`${user?.email} changed input`)
  
        if (user) {
          console.log(`User ${user.email} connected`);
          socket.broadcast.emit('update-input', msg);
        }
      });
  
      socket.on('disconnect', () => {
        console.log('disconnected');
      });
    });
  }

  res.end();
};

const getUser = async (req: NextApiRequest, res: any): Promise<User | null> => {
  const sessionId = req.cookies[lucia.sessionCookieName] ?? null;

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
