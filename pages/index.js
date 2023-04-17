import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";

const Home = () => {
    return (
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
