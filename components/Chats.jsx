import React, { useEffect, useState } from "react";
import { useAuth } from "@/firebase/authContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useChatContext } from "@/context/chatContext";

const Chats = () => {
    const [chats, setChats] = useState([]);

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

    return (
        <div className="flex py-5">
            <ul className="flex flex-col gap-3">
                {Object.entries(chats || {})
                    ?.sort((a, b) => b[1].date - a[1].date)
                    ?.map((chat) => (
                        <li
                            key={chat[0]}
                            onClick={() => handleSelect(chat[1].userInfo)}
                        >
                            <span>{chat[1].userInfo.displayName}</span>
                            <p>{chat[1].lastMessage?.text}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Chats;
