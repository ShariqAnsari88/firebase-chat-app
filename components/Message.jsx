import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/context/authContext";
import Avatar from "./Avatar";
import { formatDate, wrapEmojisInHtmlTag } from "@/utils/helpers";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { GoChevronDown } from "react-icons/go";
import Icon from "./Icon";
import Menu from "./Menu";
import { DELETED_FOR_ME, DELETED_FOR_EVERYONE } from "@/utils/constants";
import DeleteMsgPopup from "./popup/DeleteMsgPopup";

const Message = ({ message }) => {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const { data, setEditMsg } = useChatContext();
    const { currentUser } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const self = message.sender === currentUser.uid;

    const ref = useRef();

    const timestamp = new Timestamp(
        message.date?.seconds,
        message.date?.nanoseconds
    );
    const date = timestamp.toDate();

    const deleteMessage = async (action) => {
        try {
            const messageID = message.id;
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            // Create a new "messages" array that excludes the message with the matching ID
            const updatedMessages = chatDoc.data().messages.map((message) => {
                if (message.id === messageID) {
                    if (action === DELETED_FOR_ME) {
                        message.deletedInfo = {
                            [currentUser.uid]: DELETED_FOR_ME,
                        };
                    }

                    if (action === DELETED_FOR_EVERYONE) {
                        message.deletedInfo = {
                            deletedForEveryone: true,
                        };
                    }
                }
                return message;
            });

            // Update the chat document in Firestore with the new "messages" array
            await updateDoc(chatRef, { messages: updatedMessages });
        } catch (err) {
            console.error(err);
        }
    };

    const deletePopupHandler = () => {
        setShowDeletePopup(true);
        setShowMenu(false);
    };

    return (
        <div ref={ref} className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
            {showDeletePopup && (
                <DeleteMsgPopup
                    onHide={() => setShowDeletePopup(false)}
                    deleteMessage={deleteMessage}
                    className="DeleteMsgPopup"
                    noHeader={true}
                    shortHeight={true}
                    self={self}
                />
            )}
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
                    className={`group flex flex-col gap-4 py-4 px-6 rounded-3xl relative ${
                        self
                            ? "rounded-br-md bg-[#2E343D]"
                            : "rounded-bl-md bg-[#131313]"
                    }`}
                >
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                            __html: wrapEmojisInHtmlTag(message.text),
                        }}
                    ></div>
                    {message.img && (
                        <img
                            src={message.img}
                            className="rounded-3xl max-w-[250px]"
                        />
                    )}

                    <div
                        className={`${
                            showMenu ? "" : "hidden"
                        } group-hover:flex absolute top-2 ${
                            self
                                ? "left-2 bg-[#2E343D]"
                                : "right-2 bg-[#131313]"
                        }`}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <Icon
                            size="medium"
                            className="hover:bg-inherit rounded-none"
                            icon={<GoChevronDown size={24} color="#8B8D93" />}
                        />
                        {showMenu && (
                            <Menu
                                self={self}
                                setShowMenu={setShowMenu}
                                showMenu={showMenu}
                                setShowDeletePopup={deletePopupHandler}
                                editMsg={() => setEditMsg(message)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`flex items-end ${
                    self ? "justify-start flex-row-reverse mr-12" : "ml-12"
                }`}
            >
                <div className="text-xs text-[#8B8D93]">{formatDate(date)}</div>
            </div>
        </div>
    );
};

export default Message;
