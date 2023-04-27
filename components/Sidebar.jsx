import React from "react";
import Search from "./Search";
import Chats from "./Chats";
const Sidebar = () => {
    return (
        <div className="w-[500px] bg-[#161a29] p-5">
            <div className="flex flex-col gap-5">
                {/* <Search /> */}
                <Chats />
            </div>
        </div>
    );
};

export default Sidebar;
