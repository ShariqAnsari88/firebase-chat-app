import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db } from "@/firebase/firebase";
import { CLEAR_CHAT, DELETE_CHAT } from "@/utils/constants";
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ setShowMenu, showMenu }) => {
    const { data, users, dispatch, chats, setSelectedChat } = useChatContext();
    const { currentUser } = useAuth();

    const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
        (u) => u === data.user.uid
    );

    const IamBlocked = users[data.user.uid]?.blockedUsers?.find(
        (u) => u === currentUser.uid
    );

    const handleClickAway = () => {
        setShowMenu(false);
    };

    const handleBlock = async (type) => {
        if (type === "block") {
            await updateDoc(doc(db, "users", currentUser.uid), {
                blockedUsers: arrayUnion(data.user.uid),
            });
        }
        if (type === "unblock") {
            await updateDoc(doc(db, "users", currentUser.uid), {
                blockedUsers: arrayRemove(data.user.uid),
            });
        }
    };

    const handleDelete = async () => {
        try {
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            // Create a new "messages" array that excludes the message with the matching ID
            const updatedMessages = chatDoc.data().messages.map((message) => {
                message.deleteChatInfo = {
                    ...message.deleteChatInfo,
                    [currentUser.uid]: true,
                };
                return message;
            });

            // Update the chat document in Firestore with the new "messages" array
            await updateDoc(chatRef, { messages: updatedMessages });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".chatDeleted"]: true,
            });

            const chatId = Object.keys(chats || {}).filter(
                (id) => id !== data.chatId
            );

            const filteredChats = Object.entries(chats || {})
                .filter(([id, chat]) => id !== data.chatId)
                .sort((a, b) => b[1].date - a[1].date);

            if (filteredChats.length > 0) {
                setSelectedChat(filteredChats[0][1].userInfo);
                dispatch({
                    type: "CHANGE_USER",
                    payload: filteredChats[0][1].userInfo,
                });
            } else {
                dispatch({ type: "EMPTY" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                className={`w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden`}
            >
                <ul className="flex flex-col py-2">
                    {!IamBlocked && (
                        <li
                            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(
                                    isUserBlocked ? "unblock" : "block"
                                );
                            }}
                        >
                            {isUserBlocked ? "Unblock" : "Block user"}
                        </li>
                    )}
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                            handleDelete();
                        }}
                    >
                        Delete chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default ChatMenu;
