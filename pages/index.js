import { useEffect } from "react";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";

import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import LeftNav from "@/components/LeftNav";
import { useChatContext } from "@/context/chatContext";

const Home = () => {
    const { currentUser, isLoading } = useAuth();
    const router = useRouter();

    const { data } = useChatContext();

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, isLoading]);

    return !currentUser ? (
        <Loader />
    ) : (
        <div className="bg-[#131313] flex h-[100vh]">
            <div className="flex w-full shrink-0">
                <LeftNav />
                <div className="flex bg-[#202329] grow">
                    <Sidebar />
                    {data.user && <Chat />}
                </div>
            </div>
        </div>
    );
};

export default Home;
