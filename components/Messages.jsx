import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useChatContext } from "@/context/chatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useChatContext();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });
        return () => unsub();
    }, [data.chatId]);

    console.log(messages);

    return (
        <div className="grow py-10 overflow-auto">
            {messages?.map((m) => (
                <Message message={m} key={m.id} />
            ))}
            {/* <Message self={true} /> */}
        </div>
    );
};

export default Messages;
