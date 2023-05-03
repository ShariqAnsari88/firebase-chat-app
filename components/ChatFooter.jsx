import React, { useState, useEffect } from "react";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/firebase/authContext";
import {
    Timestamp,
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Icon from "./Icon";
import { CgAttachment } from "react-icons/cg";
import { TbSend } from "react-icons/tb";

let typingTimeout = null;

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const { data, editMsg, setEditMsg } = useChatContext();
    const { currentUser } = useAuth();

    useEffect(() => {
        setText(editMsg?.text || "");
    }, [editMsg]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "userChats", currentUser.uid),
            (docSnapshot) => {
                const data = docSnapshot.data();
                setIsTyping(data?.isTyping || false);
            }
        );

        return () => {
            unsubscribe();
        };
    }, [currentUser.uid]);

    const handleTyping = async (event) => {
        setText(event.target.value);
        await updateDoc(doc(db, "userChats", data?.user?.uid), {
            isTyping: true,
        });

        // If the user was previously typing, clear the timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set a new timeout for 1.5 seconds after the last keystroke
        typingTimeout = setTimeout(async () => {
            // Send a typing indicator to other users indicating that this user has stopped typing
            console.log("User has stopped typing");

            await updateDoc(doc(db, "userChats", data?.user?.uid), {
                isTyping: false,
            });

            // Reset the timeout
            typingTimeout = null;
        }, 500);
    };

    const handleSend = async () => {
        if (img) {
            const storageRef = ref(storage, uuid());
            const uploadTask = uploadBytesResumable(storageRef, img);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                    }
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text,
                                    sender: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                }),
                            });
                        }
                    );
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    sender: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
    };

    const handleEdit = async () => {
        try {
            const messageID = editMsg.id;
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            if (img) {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            async (downloadURL) => {
                                // Create a new "messages" array that excludes the message with the matching ID
                                let updatedMessages = chatDoc
                                    .data()
                                    .messages.map((message) => {
                                        if (message.id === messageID) {
                                            message.text = text;
                                            message.img = downloadURL;
                                        }
                                        return message;
                                    });

                                await updateDoc(chatRef, {
                                    messages: updatedMessages,
                                });
                            }
                        );
                    }
                );
            } else {
                // Create a new "messages" array that excludes the message with the matching ID
                let updatedMessages = chatDoc.data().messages.map((message) => {
                    if (message.id === messageID) {
                        message.text = text;
                    }
                    return message;
                });
                await updateDoc(chatRef, { messages: updatedMessages });
            }

            setText("");
            setImg(null);
            setEditMsg(null);
        } catch (err) {
            console.error(err);
        }
    };

    const onKeyUp = (event) => {
        if (event.key === "Enter") {
            !editMsg ? handleSend() : handleEdit();
        }
    };

    return (
        <div className="flex justify-between items-center bg-[#131313]/[0.5] p-2 rounded-xl relative">
            <div>
                <input
                    type="file"
                    id="fileUploader"
                    className="hidden"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="fileUploader">
                    <Icon
                        size="large"
                        icon={<CgAttachment size={20} color="#8B8D93" />}
                    />
                </label>
            </div>

            {isTyping && (
                <div className="absolute -top-6 left-4 bg-[#202329] w-full h-6">
                    <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
                        {`${data.user.displayName} is typing`}
                        <img src="/typing.svg" />
                    </div>
                </div>
            )}

            <input
                type="text"
                className="w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-[#B1B2B6] outline-none text-base"
                placeholder="Type a message"
                value={text}
                onChange={handleTyping}
                onKeyUp={onKeyUp}
            />

            <button
                onClick={!editMsg ? handleSend : handleEdit}
                className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${
                    text.trim().length > 0 ? "bg-[#6b8afd]" : ""
                }`}
            >
                <TbSend size={20} color="#fff" />
            </button>
        </div>
    );
};

export default Input;
