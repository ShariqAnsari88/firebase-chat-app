import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db } from "@/firebase/firebase";
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ setShowMenu, showMenu }) => {
    const { data, users } = useChatContext();
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
