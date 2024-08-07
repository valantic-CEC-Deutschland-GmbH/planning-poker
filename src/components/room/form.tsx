'use client'

import { InputType } from "@/interfaces/input";
import Input from "../ui/form/input";
import { SquaresPlusIcon } from "@heroicons/react/16/solid";
import { FormEvent, useState } from "react";
import { addToast, ToastType } from "../ui/toast/toast";
import { useRouter } from "next/navigation";
import { NewRoomResponseInterface } from "@/interfaces/room";

export interface NewRoomOptions {
    ownerId: number;
}

export default function NewRoomForm(options: NewRoomOptions) {
    const router = useRouter()
    const [name, setName] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await fetch('/api/room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, ownerId: options.ownerId }),
        })

        const data: NewRoomResponseInterface = await response.json()

        if (data.message) {
            addToast(data.isSuccess ? ToastType.SUCCESS : ToastType.ERROR, data.isSuccess ? 'Room was created' : data.message)
        }

        if (data.isSuccess) {
            router.push(`/room/${data.message}/options`)
        }

        data.errors.map(error => {
            addToast(ToastType.ERROR, error)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input type={InputType.TEXT} placeholder="room" setter={setName} autocomplete="room-name" icon={<SquaresPlusIcon className="h-4 w-4 opacity-70" />} />
                <button type="submit" className='btn w-full btn-primary' >Create new room</button>
            </form>
        </>
    )
}