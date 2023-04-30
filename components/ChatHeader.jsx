import React from "react";
import { useChatContext } from "@/context/chatContext";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { GoKebabHorizontal } from "react-icons/go";
import { BiBlock } from "react-icons/bi";
import { RiChatDeleteLine } from "react-icons/ri";
import useIsOnline from "@/hook/useIsOnline";

const ChatHeader = (props) => {
    const { data } = useChatContext();
    const { online } = useIsOnline(data?.user?.uid);
    return (
        <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
            {data?.user && (
                <div className="flex items-center gap-3">
                    <Avatar size="large" user={data?.user} />
                    <div>
                        <div className="font-medium">
                            {data.user.displayName}
                        </div>
                        <p className="text-sm text-[#8B8D93]">
                            {online ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Icon
                    size="large"
                    icon={<BiBlock size={20} color="#8B8D93" />}
                />
                <Icon
                    size="large"
                    icon={<RiChatDeleteLine size={20} color="#8B8D93" />}
                />
            </div>
        </div>
    );
};

export default ChatHeader;
