import RoomUserList from "@/components/room/user-list";
import { lucia } from "@/utils/auth";
import { getUser } from "@/utils/auth"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export default async function Room({ params }: { params: { id: string } }) {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? '';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl">Room: {params.id}</h1>
            <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoomUserList params={{roomId: params.id}} />
            </section>
        </div>
    )
}