import { getRoomsByOwnerId } from "@/utils/room";
import Link from "next/link";

export default async function RoomList({ params }: { params: { ownerId: number } }) {
    const rooms = await getRoomsByOwnerId(params.ownerId)

    return (
        <div>
            <h2 className="text-3xl uppercase">My rooms</h2>
            <div className="flex w-full flex-col">
                {rooms.map(room => (
                    <div key={room.id}>
                        <div className="divider"></div>
                        <div className="card bg-base-300 rounded-box h-20 p-3 flex flex-row justify-between items-center">
                            <span className="text-xl m-2 ml-4">{room.name}</span>
                            <div className="space-x-2">
                                <Link href={`/room/${room.id}`} className="btn btn-primary">Open</Link>
                                <Link href={`/room/${room.id}/options`} className="btn btn-secondary">Options</Link>
                                <button type="button" className="btn bg-base-100">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}