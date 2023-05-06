import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/context/authContext";
import Loader from "@/components/Loader";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";

const Login = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push("/");
        }
    }, [currentUser, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error);
        }
    };

    return isLoading || (!isLoading && !!currentUser) ? (
        <Loader />
    ) : (
        <div className="h-[100vh] flex justify-center items-center">
            <form
                className="flex flex-col gap-3 w-[350px] p-5 bg-gray-600"
                onSubmit={handleSubmit}
            >
                <input
                    type="email"
                    placeholder="Email"
                    className="text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="text-black"
                />
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
