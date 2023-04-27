import React, { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useChatContext } from "@/context/chatContext";
import Avatar from "./Avatar";
import moment from "moment";
import { RiSearch2Line } from "react-icons/ri";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
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
        setSelectedChat(user);
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
        <div className="flex flex-col h-full">
            <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-[#202329] py-5">
                <RiSearch2Line
                    className="absolute top-9 left-12"
                    color="#B1B2B6"
                />
                <input
                    type="Text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search username..."
                    className="w-[300px] h-12 rounded-xl bg-[#2E343D] pl-11 pr-5 placeholder:text-[#B1B2B6] outline-none text-base"
                />
            </div>
            <ul className="flex flex-col w-full my-5 gap-[2px]">
                {filteredChats?.map((chat) => {
                    const timestamp = new Timestamp(
                        chat[1].date?.seconds,
                        chat[1].date?.nanoseconds
                    );
                    const date = timestamp.toDate();
                    return (
                        <li
                            key={chat[0]}
                            onClick={() => handleSelect(chat[1].userInfo)}
                            className={`h-[90px] flex items-center gap-4 rounded-3xl hover:bg-[#2E343D] p-4 cursor-pointer ${
                                selectedChat?.uid === chat[1].userInfo.uid
                                    ? "bg-[#2E343D]"
                                    : ""
                            }`}
                        >
                            <Avatar size="x-large" user={chat[1].userInfo} />
                            <div className="flex flex-col gap-1 grow">
                                <span className="text-base text-white flex  items-center justify-between">
                                    <div className="font-medium">
                                        {chat[1].userInfo.displayName}
                                    </div>
                                    <div className="text-sm text-[#8B8D93]">
                                        {formatDate(date)}
                                    </div>
                                </span>
                                <p className="text-sm text-[#8B8D93]">
                                    {chat[1].lastMessage?.text ||
                                        "Send first message"}
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
