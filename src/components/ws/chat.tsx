'use client'

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { addToast, ToastType } from '../ui/toast/toast'
import DatabaseRoom from '@/interfaces/room'
import { DatabaseEstimationWithUser } from '@/interfaces/estimation'

let socket: Socket

export default function Chat({ params }: { params: { sessionId: string, userId: number, room: DatabaseRoom, roomUserId: number } }) {
  const [shown, setShown] = useState(params.room.status === 1 ? true : false)
  const [estimations, setEstimations] = useState<DatabaseEstimationWithUser[]>([])

  const userId = params.userId
  const room = params.room
  const ownerId = room.ownerId

  useEffect(() => {
    if (!socket) {
      socketInitializer()
    }
  }, [])

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io('http://localhost:3000', {
      auth: {
        token: params.sessionId,
      },
      query: {
        "roomId": room.id
      }
    });

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('estimations', (msg: string) => {
      setEstimations(JSON.parse(msg))
    })

    socket.on('connected', (msg: string) => {
      addToast(ToastType.INFO, msg)
    })

    socket.on('disconnected', (msg: string) => {
      addToast(ToastType.INFO, msg)
    })
  }

  async function handleClick() {
    socket.emit('show-estimations', JSON.stringify({
      id: room.id,
      status: !shown ? 1 : 0,
    }))
    setShown(!shown)
  }

  async function handleAddEstimation(time: number) {
    socket.emit('add-estimation', JSON.stringify({
      roomUserId: params.roomUserId,
      estimation: time
    }))
  }

  //TODO configurable in options
  const availableTimes = [1,2,4,6,8,10,12,14,16,18,20,22,24,28,32,36,40]

  return (
    <div className="mb-6 space-y-6">
      {userId === ownerId && (<button type="button" className="btn btn-primary" onClick={() => handleClick()}>{!shown ? 'Show estimations' : 'Hide estimations'}</button>)}
      <section className="grid grid-col-4 md:grid-cols-8 gap-4">
        {availableTimes.map(time => (
          <div className="card bg-base-300 w-full shadow-xl cursor-pointer" key={time} onClick={() => handleAddEstimation(time)}>
            <div className="card-body">
              <h2 className="card-title text-4xl">{time} h</h2>
            </div>
          </div>
        ))}
      </section>
      <div className='divider' />
      <section className="grid grid-col-2 md:grid-cols-4 gap-4">
        {estimations.map(estimation => (
          <div className="card bg-base-300 w-full shadow-xl cursor-pointer" key={estimation.id} >
            <div className="card-body">
              <h2 className="card-title text-4xl">{estimation.time} h</h2>
              <div className='divider' />
              <span>{estimation.roomUser.user.firstName} {estimation.roomUser.user.lastName}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}