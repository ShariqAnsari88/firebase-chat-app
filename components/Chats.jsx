import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { db } from "@/firebase/firebase";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { useChatContext } from "@/context/chatContext";
import Avatar from "./Avatar";
import { RiSearch2Line } from "react-icons/ri";
import { formatDate } from "@/utils/helpers";

const Chats = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [search, setSearch] = useState("");
    const [isBlockExecuted, setisBlockExecuted] = useState(false);
    const [isUsersFetched, setisUsersFetched] = useState(false);

    const { currentUser } = useAuth();
    const { users, setUsers, data, dispatch, resetFooterStates } =
        useChatContext();

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        setUsers([]);
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            setUsers((prevState) => {
                return {
                    ...prevState,
                    [doc.id]: { ...doc.data() },
                };
            });
        });
        setisUsersFetched(true);
    };

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(
                doc(db, "userChats", currentUser.uid),
                (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setChats(data);

                        if (data.hasOwnProperty("isTyping"))
                            delete data.isTyping;

                        if (isUsersFetched && !isBlockExecuted) {
                            const firstChat = Object.values(data).sort(
                                (a, b) => {
                                    return b.date - a.date;
                                }
                            )[0];
                            const user = users[firstChat?.userInfo?.uid];
                            setSelectedChat(user);
                            dispatch({
                                type: "CHANGE_USER",
                                payload: user,
                            });
                            setisBlockExecuted(true);
                        }
                    }
                }
            );
            return () => unsub();
        };
        currentUser.uid && getChats();
    }, [isUsersFetched, !isBlockExecuted]);

    useEffect(() => {
        resetFooterStates();
    }, [data?.chatId]);

    const filteredChats = Object.entries(chats || {})
        .filter(
            ([, chat]) =>
                chat?.userInfo?.displayName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                chat?.lastMessage?.text
                    .toLowerCase()
                    .includes(search.toLowerCase())
        )
        .sort((a, b) => b[1].date - a[1].date);

    const handleSelect = (user) => {
        setSelectedChat(user);
        dispatch({ type: "CHANGE_USER", payload: user });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-[#202329] py-5">
                <RiSearch2Line
                    className="absolute top-9 left-12"
                    color="#B1B2B6"
                />
                <input
                    type="Text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search username..."
                    className="w-[300px] h-12 rounded-xl bg-[#131313]/[0.5] pl-11 pr-5 placeholder:text-[#B1B2B6] outline-none text-base"
                />
            </div>
            <ul className="flex flex-col w-full my-5 gap-[2px]">
                {Object.keys(users || {}).length > 0 &&
                    filteredChats?.map((chat) => {
                        const timestamp = new Timestamp(
                            chat[1].date?.seconds,
                            chat[1].date?.nanoseconds
                        );
                        const date = timestamp.toDate();
                        const user = users[chat[1].userInfo.uid];
                        return (
                            <li
                                key={chat[0]}
                                onClick={() => handleSelect(user)}
                                className={`h-[90px] flex items-center gap-4 rounded-3xl hover:bg-[#131313] p-4 cursor-pointer ${
                                    selectedChat?.uid === user.uid
                                        ? "bg-[#131313]"
                                        : ""
                                }`}
                            >
                                <Avatar size="x-large" user={user} />
                                <div className="flex flex-col gap-1 grow">
                                    <span className="text-base text-white flex  items-center justify-between">
                                        <div className="font-medium">
                                            {user.displayName}
                                        </div>
                                        <div className="text-xs text-[#8B8D93]">
                                            {formatDate(date)}
                                        </div>
                                    </span>
                                    <p className="text-sm text-[#8B8D93] line-clamp-1">
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
