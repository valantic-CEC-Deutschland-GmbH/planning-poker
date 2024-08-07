import NewRoomForm from "@/components/room/form";
import RoomList from "@/components/room/list";
import { getUser } from "@/utils/user";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <>
            <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <NewRoomForm ownerId={user.id} />
                <RoomList params={{ownerId: user.id}} />
            </section>
        </>
    )
}