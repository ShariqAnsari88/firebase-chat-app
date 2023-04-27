import React, { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useChatContext } from "@/context/chatContext";
import Avatar from "./Avatar";
import moment from "moment";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [query, setQuery] = useState("");
    const { currentUser } = useAuth();
    const { dispatch } = useChatContext();

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(
                doc(db, "userChats", currentUser.uid),
                (doc) => {
                    setChats(doc.data());
                    // dispatch({
                    //     type: "CHANGE_USER",
                    //     payload: Object.entries(doc.data() || {})[0][1]
                    //         ?.userInfo,
                    // });
                }
            );
            return () => unsub();
        };
        currentUser.uid && getChats();
    }, []);

    console.log(chats);

    const handleSelect = (user) => {
        dispatch({ type: "CHANGE_USER", payload: user });
    };

    const formatDate = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) {
            return "now";
        }

        if (diff < 3600000) {
            return `${Math.round(diff / 60000)} min ago`;
        }

        if (diff < 86400000) {
            return moment(date).format("h:mm A");
        }

        return moment(date).format("MM/DD/YY");
    };

    const filteredChats = Object.entries(chats || {})
        .filter(
            ([, chat]) =>
                chat.userInfo.displayName
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                chat.lastMessage?.text
                    .toLowerCase()
                    .includes(query.toLowerCase())
        )
        .sort((a, b) => b[1].date - a[1].date);

    return (
        <div className="flex flex-col">
            <input
                type="Text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search username..."
                className="w-full h-10 rounded-full bg-[#121521] px-5 placeholder:text-white/[0.1] outline-none text-base"
            />
            <ul className="flex flex-col my-5">
                {filteredChats?.map((chat) => {
                    const timestamp = new Timestamp(
                        chat[1].date.seconds,
                        chat[1].date.nanoseconds
                    );
                    const date = timestamp.toDate();
                    return (
                        <li
                            key={chat[0]}
                            onClick={() => handleSelect(chat[1].userInfo)}
                            className="flex items-center gap-4 border-b border-[#1F2437] hover:bg-[#2D3450] p-4 cursor-pointer"
                        >
                            <Avatar size="large" user={chat[1].userInfo} />
                            <div className="flex flex-col grow">
                                <span className="text-base text-white/[0.75] flex  items-center justify-between">
                                    <div>{chat[1].userInfo.displayName}</div>
                                    <div className="text-sm text-white/[0.50]">
                                        {formatDate(date)}
                                    </div>
                                </span>
                                <p className="text-sm text-white/[0.50]">
                                    {chat[1].lastMessage?.text}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Chats;
