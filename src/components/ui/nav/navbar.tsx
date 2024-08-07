import Link from "next/link";
import { redirect } from "next/navigation";

export default function Navbar() {
    async function logout() {
        'use server'

        await fetch('/api/auth/logout')
        redirect('/login')
    }

    return (
        <div className="navbar bg-base-300">
            <div className="navbar-start">
                <Link className="btn btn-ghost text-xl" href="/">
                    <img className="h-10"src="/valantic-logo-white.png"/>
                </Link>
            </div>
            <div className="navbar-end lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <details>
                            <summary>Profile</summary>
                            <ul className="p-2">
                                <li><Link href="/api/auth/logout">Logout</Link></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    )
}