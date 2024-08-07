'use client'

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { addToast, ToastType } from '../ui/toast/toast'

let socket: Socket

export interface Chat {
    roomId: string
    sessionId: string
} 

export default function Chat(chat: Chat) {
  const [input, setInput] = useState('')

  //check because of next Link else new connection will be opened and your are connected multiple times
  if (!socket) {
    useEffect(() => {
      socketInitializer()
    }, [])
  }

  const socketInitializer = async () => {
    
    //create ws TODO creates to many connections idk why yet
    await fetch('/api/socket')
    socket = io('http://localhost:3000', {
      auth: {
        token: chat.sessionId,
      },
      query: {
        "roomId": chat.roomId
      }
    });

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update', (msg: string) => {
      setInput(msg)
    })

    //To many info toasts on other users side
    socket.on('connected', (msg: string) => {
      addToast(ToastType.INFO, msg)
    })

    //Same her
    socket.on('disconnected', (msg: string) => {
      addToast(ToastType.INFO, msg)
    })
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    socket.emit('input', e.target.value)
  }

  return (
    <div className="mb-6">
      <label 
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Large input</label>
      <input
        onChange={onChangeHandler}
        value={input}
        type="text"
        id="large-input"
        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  )
}