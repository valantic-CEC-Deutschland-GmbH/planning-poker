import Chat from '@/components/ws/chat'
import { lucia } from '@/utils/auth'
import { cookies } from 'next/headers';

const Home = () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? '';

  return (
    <>
      <Chat cookie={sessionId} />
    </>
  )
}

export default Home
