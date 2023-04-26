import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChatContext } from "@/context/chatContext";
const Chat = () => {
    const { data } = useChatContext();
    return (
        <div className="flex flex-col h-[calc(100vh-40px)]">
            <div className="flex justify-between items-center">
                <div>{data.user?.displayName}</div>
                <div className="flex items-center gap-5">
                    <div>Icon 1</div>
                    <div>Icon 2</div>
                    <div>Icon 3</div>
                </div>
            </div>
            {data.chatId && (
                <>
                    <Messages />
                    <Input />
                </>
            )}
        </div>
    );
};

export default Chat;
