import React, { useEffect, useRef } from "react";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/firebase/authContext";

const Message = ({ message }) => {
    const { data } = useChatContext();
    const { currentUser } = useAuth();

    const self = message.sender === currentUser.uid;

    const ref = useRef();

    useEffect(() => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`flex gap-5 mb-5 ${
                self ? "justify-start flex-row-reverse" : ""
            }`}
        >
            <div className="flex flex-col">
                <div>{self ? "You" : data.user.displayName}</div>
                <div>date & time</div>
            </div>
            <div
                className={`flex flex-col gap-4 p-4 ${
                    self ? "bg-blue-900" : "bg-slate-900"
                }`}
            >
                <div>{message.text}</div>
                {message.img && <img src={message.img} />}
            </div>
        </div>
    );
};

export default Message;
