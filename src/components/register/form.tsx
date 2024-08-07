'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/16/solid";
import Input from "../ui/form/input";
import { addToast, ToastType } from "../ui/toast/toast";
import { AuthResponseInterface } from "@/interfaces/auth";
import { InputType } from "@/interfaces/input";

export default function RegisterForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName, lastName }),
        })

        const data: AuthResponseInterface = await response.json()

        if (data.message) {
            addToast(data.isSuccess ? ToastType.SUCCESS : ToastType.ERROR, data.message)
        }

        if (data.isSuccess) {
            router.push('/login')
        }

        data.errors.map(error => {
            addToast(ToastType.ERROR, error)
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input type={InputType.EMAIL} placeholder="email" setter={setEmail} autocomplete="email" icon={<EnvelopeIcon className="h-4 w-4 opacity-70" />} />
            <Input type={InputType.TEXT} placeholder="firstname" setter={setFirstName} autocomplete="given-name" icon={<UserIcon className="h-4 w-4 opacity-70" />} />
            <Input type={InputType.TEXT} placeholder="lastname" setter={setLastName} autocomplete="family-name" icon={<UserIcon className="h-4 w-4 opacity-70" />} />
            <Input type={InputType.PASSWORD} placeholder="password" setter={setPassword} icon={<KeyIcon className="h-4 w-4 opacity-70" />} />
            <button type="submit" className="btn btn-primary w-full">Sign up</button>
        </form>
    )
}