import React, { useEffect, useState } from "react";
import PopupWrapper from "./PopupWrapper";
import Search from "../Search";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Avatar from "../Avatar";

import { useAuth } from "@/firebase/authContext";
import { useChatContext } from "@/context/chatContext";

const UsersPopup = (props) => {
    const [users, setUsers] = useState([]);

    const { currentUser } = useAuth();
    const { dispatch } = useChatContext();

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        setUsers([]);
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            setUsers((prevState) => {
                return [...prevState, { ...doc.data(), id: doc.id }];
            });
        });
    };

    const handleSelect = async (user) => {
        try {
            const combinedId =
                currentUser.uid > user.uid
                    ? currentUser.uid + user.uid
                    : user.uid + currentUser.uid;
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                const currentUserChatRef = await getDoc(
                    doc(db, "userChats", currentUser.uid)
                );
                const userChatRef = await getDoc(
                    doc(db, "userChats", user.uid)
                );

                if (!currentUserChatRef.exists()) {
                    await setDoc(doc(db, "userChats", currentUser.uid), {});
                }
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL || null,
                        color: user.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                if (!userChatRef.exists()) {
                    await setDoc(doc(db, "userChats", user.uid), {});
                }
                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL || null,
                        color: currentUser.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }

            dispatch({ type: "CHANGE_USER", payload: user });
            props.onHide();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <PopupWrapper {...props} title="Add User">
            <Search />

            <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
                <div className="absolute w-full">
                    {users &&
                        users.map((user) => (
                            <div
                                onClick={() => handleSelect(user)}
                                className="flex items-center gap-4 rounded-xl hover:bg-[#2E343D] py-2 px-4 cursor-pointer"
                            >
                                <Avatar size="large" user={user} />
                                <div className="flex flex-col gap-1 grow">
                                    <span className="text-base text-white flex  items-center justify-between">
                                        <div className="font-medium">
                                            {user.displayName}
                                        </div>
                                    </span>
                                    <p className="text-sm text-[#8B8D93]">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </PopupWrapper>
    );
};

export default UsersPopup;