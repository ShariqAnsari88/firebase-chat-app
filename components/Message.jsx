import React, { useEffect, useRef } from "react";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/firebase/authContext";
import Avatar from "./Avatar";
import { formatDate } from "@/utils/helpers";
import { Timestamp } from "firebase/firestore";

const Message = ({ message }) => {
    const { data } = useChatContext();
    const { currentUser } = useAuth();

    const self = message.sender === currentUser.uid;

    const ref = useRef();

    const timestamp = new Timestamp(
        message.date?.seconds,
        message.date?.nanoseconds
    );
    const date = timestamp.toDate();

    return (
        <div ref={ref} className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
            <div
                className={`flex items-end gap-3 mb-1 ${
                    self ? "justify-start flex-row-reverse" : ""
                }`}
            >
                <Avatar
                    size="small"
                    user={self ? currentUser : data.user}
                    className="mb-4"
                />
                <div
                    className={`flex flex-col gap-4 p-4 rounded-3xl ${
                        self
                            ? "rounded-br-md bg-[#2E343D]"
                            : "rounded-bl-md bg-[#131313]"
                    }`}
                >
                    <div className="text-sm">{message.text}</div>
                    {message.img && (
                        <img
                            src={message.img}
                            className="rounded-3xl max-w-[250px]"
                        />
                    )}
                </div>
            </div>
            <div
                className={`flex items-end ${
                    self ? "justify-start flex-row-reverse mr-12" : "ml-12"
                }`}
            >
                <div className="text-xs text-[#8B8D93]">{formatDate(date)}</div>
            </div>

            {/* <div className={`flex flex-col gap-1 ${self ? "items-end" : ""}`}>
                <div className="text-xs text-[#8B8D93]">{formatDate(date)}</div>
            </div> */}
        </div>
    );
};

export default Message;
