import React, { useState } from "react";
import { useAuth } from "@/firebase/authContext";
import Avatar from "./Avatar";
import Icon from "./Icon";

import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";
import UsersPopup from "./popup/UsersPopup";

const LeftNav = () => {
    const [userPopup, setUserPopup] = useState(false);
    const { signOut, currentUser } = useAuth();
    return (
        <div className="w-[80px] flex flex-col items-center justify-between py-5 shrink-0">
            {currentUser && <Avatar size="large" user={currentUser} />}

            <div className="flex flex-col gap-3">
                <Icon
                    size="x-large"
                    icon={<AiOutlineUserAdd size={24} />}
                    onClick={() => setUserPopup(!userPopup)}
                />
                <Icon size="x-large" icon={<IoSettingsOutline size={24} />} />
                <Icon
                    size="x-large"
                    icon={<IoLogOutOutline size={24} />}
                    onClick={signOut}
                />
            </div>

            {userPopup && <UsersPopup onHide={() => setUserPopup(false)} />}
        </div>
    );
};

export default LeftNav;
