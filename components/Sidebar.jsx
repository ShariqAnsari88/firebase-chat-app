import React from "react";
import Chats from "./Chats";
const Sidebar = () => {
    return (
        <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
            <div className="flex flex-col h-full">
                <Chats />
            </div>
        </div>
    );
};

export default Sidebar;
