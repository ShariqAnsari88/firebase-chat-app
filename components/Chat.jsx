import React from "react";
import Messages from "./Messages";
import Input from "./Input";
const Chat = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-40px)]">
            <div className="flex justify-between items-center">
                <div>Username</div>
                <div className="flex items-center gap-5">
                    <div>Icon 1</div>
                    <div>Icon 2</div>
                    <div>Icon 3</div>
                </div>
            </div>
            <Messages />
            <Input />
        </div>
    );
};

export default Chat;
