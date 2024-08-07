import Chat from "@/components/ws/chat";
import { lucia } from "@/utils/auth";
import { getUser } from "@/utils/user"
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
            <Chat sessionId={sessionId} roomId={params.id} />

            <section className="grid grid-col-2 md:grid-cols-4 gap-4">
                <div className="card bg-base-300 w-full shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-4xl">24 h</h2>
                        <div className="divider"></div>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className="card bg-base-300 w-full shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-4xl">24 h</h2>
                        <div className="divider"></div>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className="card bg-base-300 w-full shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-4xl">24 h</h2>
                        <div className="divider"></div>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className="card bg-base-300 w-full shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-4xl">24 h</h2>
                        <div className="divider"></div>
                        <p>{user.email}</p>
                    </div>
                </div>
            </section>
        </div>
    )
}