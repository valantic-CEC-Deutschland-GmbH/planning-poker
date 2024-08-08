import Link from "next/link";
import {getUser} from "@/utils/auth";
import {redirect} from "next/navigation";
import RegisterForm from "@/components/register/form";

export default async function Login() {
    const user = await getUser();
    if (user) {
        redirect("/");
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        src="/valantic-logo-white.png"
                        alt="Valantic"
                        className="mx-auto h-20 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
                        Create an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <RegisterForm />
                    <p className="mt-10 text-center text-sm text-neutral">
                        Already a member?{' '}
                        <Link href="/login" className="font-semibold leading-6 link link-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}