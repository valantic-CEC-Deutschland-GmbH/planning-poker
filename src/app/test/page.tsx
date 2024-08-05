import { redirect } from "next/navigation";
import {getUser} from "@/utils/user";

export default async function Test() {
    const user = await getUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <div>
            <h1>Test</h1>
        </div>
    )
}