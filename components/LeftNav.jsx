import React from "react";
import { useAuth } from "@/firebase/authContext";
import Avatar from "./Avatar";
import Icon from "./Icon";

import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";

const LeftNav = () => {
    const { signOut, currentUser } = useAuth();
    return (
        <div className="w-16 bg-[#1F2437] flex flex-col items-center justify-between py-5">
            <Avatar size="large" user={currentUser} />

            <div className="flex flex-col gap-3">
                <Icon size="large" icon={<AiOutlineUserAdd size={24} />} />
                <Icon size="large" icon={<IoSettingsOutline size={24} />} />
                <Icon
                    size="large"
                    icon={<IoLogOutOutline size={24} onClick={signOut} />}
                />
            </div>
        </div>
    );
};

export default LeftNav;
