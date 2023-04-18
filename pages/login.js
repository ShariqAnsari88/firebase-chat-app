import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/firebase/authContext";
import Loader from "@/components/Loader";

const Login = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push("/");
        }
    }, [currentUser, isLoading]);

    return isLoading || (!isLoading && !!currentUser) ? (
        <Loader />
    ) : (
        <div className="h-[100vh] flex justify-center items-center">
            <form className="flex flex-col gap-3 w-[350px] p-5 bg-gray-600">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
