'use client'

import { InputType } from "@/interfaces/input"
import Input from "../ui/form/input"
import { FormEvent, useEffect, useState } from "react"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid"
import DatabaseUser from "@/interfaces/user"
import { NewRoomResponseInterface } from "@/interfaces/room"
import { addToast, ToastType } from "../ui/toast/toast"
import { DatabaseRoomUserWithUser } from "@/interfaces/roomUser"

export default function RoomUserList({ params }: { params: { roomId: string } }) {
    const [email, setEmail] = useState('')
    const [searchUsers, setSearchUsers] = useState<DatabaseUser[]>([])
    const [roomUsers, setRoomUsers] = useState<DatabaseRoomUserWithUser[]>([])

    //Only call once could be that it is rendered more the once due to react/nextJs
    useEffect(() => {
        loadUsers()
    }, [])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (email) {
            const response = await fetch(`/api/user?like=${email}`)
            const data: DatabaseUser[] = await response.json()

            setSearchUsers(data)
        } else {
            setSearchUsers([])
        }
    }

    async function handleAdd(userId: number | undefined) {
        if (!userId) return

        console.log(userId)

        const response = await fetch('/api/room/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId: params.roomId, userId: userId }),
        })

        //TODO
        const data: NewRoomResponseInterface = await response.json()

        if (data.message) {
            addToast(data.isSuccess ? ToastType.SUCCESS : ToastType.ERROR, data.message)
        }

        if (data.isSuccess) {
            loadUsers()
        }

        data.errors.map(error => {
            addToast(ToastType.ERROR, error)
        })
    }

    async function handleDelete(roomId: number|undefined) {
        if (!roomId) return

        const response = await fetch('/api/room/user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: roomId }),
        })

        //TODO
        const data: NewRoomResponseInterface = await response.json()

        if (data.message) {
            addToast(data.isSuccess ? ToastType.SUCCESS : ToastType.ERROR, data.message)
        }

        if (data.isSuccess) {
            loadUsers()
        }

        data.errors.map(error => {
            addToast(ToastType.ERROR, error)
        })
    }


    async function loadUsers() {
        const response = await fetch(`/api/room/user?roomId=${params.roomId}&user=1`)
        const roomUsers: DatabaseRoomUserWithUser[] = await response.json()
        setRoomUsers(roomUsers)
    }

    return (
        <>
            <div className="flex w-full flex-col gap-4">
                <h2 className="text-3xl">Add a users</h2>
                <form onSubmit={handleSubmit} className="flex justify-between">
                    <Input type={InputType.TEXT} placeholder="email" setter={setEmail} autocomplete="email" icon={<MagnifyingGlassIcon className="h-4 w-4 opacity-70" />} className="w-full" />
                    <button type="submit" className='btn btn-primary'>Search</button>
                </form>
                <div className="flex w-full flex-col">
                    {searchUsers.map(user => (
                        <div key={user.id}>
                            <div className="divider"></div>
                            <div className="card bg-base-300 rounded-box h-20 p-3 flex flex-row justify-between items-center">
                                <span className="text-xl m-2 ml-4">{user.email}</span>
                                <div className="space-x-2">
                                    <button type="button" className="btn btn-primary" onClick={() => handleAdd(user.id)}>Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="flex w-full flex-col">
                    <h2 className="text-3xl">Users</h2>
                    {roomUsers.map(roomUser => (
                        <div key={roomUser.id}>
                            <div className="divider"></div>
                            <div className="card bg-base-300 rounded-box h-20 p-3 flex flex-row justify-between items-center">
                                <span className="text-xl m-2 ml-4">
                                    {roomUser.user?.firstName} {roomUser.user?.lastName}
                                </span>
                                <span className="text-xl font-light m-2 ml-4">
                                    {roomUser.user?.email}
                                </span>
                                <button type="button" className="btn btn-sm btn-primary" onClick={() => handleDelete(roomUser.id)}>
                                    <XMarkIcon className="h-6 opacity-70" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}