import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { useChatContext } from "@/context/chatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useChatContext();
    const ref = useRef();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
            scrollToBottom();
        });
        return () => unsub();
    }, [data.chatId]);

    const scrollToBottom = () => {
        const chatContainer = ref.current;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    console.log(messages);

    return (
        <div
            ref={ref}
            className="grow p-5 overflow-auto scrollbar flex flex-col"
        >
            {messages?.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    );
};

export default Messages;
