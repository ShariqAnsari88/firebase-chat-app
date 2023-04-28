import React, { useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { useAuth } from "@/firebase/authContext";
import {
    Timestamp,
    arrayUnion,
    doc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Icon from "./Icon";
import { CgAttachment } from "react-icons/cg";
import { TbSend } from "react-icons/tb";

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { data } = useChatContext();
    const { currentUser } = useAuth();

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

    return (
        <div className="flex justify-between items-center bg-[#131313]/[0.5] p-2 rounded-xl">
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

            <input
                type="text"
                className="w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-[#B1B2B6] outline-none text-base"
                placeholder="Type a message"
                onChange={(e) => setText(e.target.value)}
                value={text}
            />

            <button
                onClick={handleSend}
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
