import { useEffect, useState } from "react";

import { useAuth } from "@/firebase/authContext";
import { useRouter } from "next/router";

import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import LeftNav from "@/components/LeftNav";

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
        <div className="bg-[#121521] flex h-[100vh]">
            <div className="flex">
                <LeftNav />
                <Sidebar />
                <div className="w-[calc(100%-400px)]">
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default Home;
