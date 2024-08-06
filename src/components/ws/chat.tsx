'use client'

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

let socket: Socket

export interface Chat {
    cookie: string
} 

const Chat = (chat: Chat) => {
  const [input, setInput] = useState('')

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    //create ws
    await fetch('/api/socket')
    //socket = io()

    console.log(chat.cookie)

    socket = io('http://localhost:3000', {
      auth: {
        token: chat.cookie
      }
    });

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', (msg: string) => {
      setInput(msg)
    })
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    socket.emit('input-change', e.target.value)
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

export default Chat
