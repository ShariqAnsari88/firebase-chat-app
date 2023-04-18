import { useEffect, useState } from "react";

import { useAuth } from "@/firebase/authContext";
import { useRouter } from "next/router";

import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";

const Home = () => {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, isLoading]);

    return !currentUser ? (
        <Loader />
    ) : (
        <div className="p-5">
            <div className="flex">
                <div className="w-[400px] px-5">
                    <Sidebar />
                </div>
                <div className="w-[calc(100%-400px)] px-5">
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default Home;
