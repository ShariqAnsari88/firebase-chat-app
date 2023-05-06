import React, { useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import Avatar from "./Avatar";
import { RiSearch2Line } from "react-icons/ri";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useAuth();
    const { dispatch } = useChatContext();

    const onKeyUp = async (e) => {
        if (e.code === "Enter" && !!username) {
            try {
                setErr(false);
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("displayName", "==", username));

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    setErr(true);
                    setUser(null);
                } else {
                    querySnapshot.forEach((doc) => {
                        setUser(doc.data());
                    });
                }
            } catch (error) {
                console.error(error);
                setErr(error);
            }
        }
    };

    const handleSelect = async () => {
        try {
            const combinedId =
                currentUser.uid > user.uid
                    ? currentUser.uid + user.uid
                    : user.uid + currentUser.uid;
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        color: user.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        color: currentUser.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }

            setUser(null);
            setUsername("");
            dispatch({ type: "CHANGE_USER", payload: user });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="shrink-0">
            <div className="relative">
                <RiSearch2Line
                    className="absolute top-4 left-4"
                    color="#B1B2B6"
                />
                <input
                    type="text"
                    placeholder="Search user..."
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyUp={onKeyUp}
                    value={username}
                    autoFocus
                    className="w-full h-12 rounded-xl bg-[#131313]/[0.5] pl-11 pr-16 placeholder:text-[#B1B2B6] outline-none text-base"
                />
                <span className="absolute top-[14px] right-4 text-sm text-[#8B8D93]">
                    Enter
                </span>
            </div>
            {err && (
                <>
                    <div className="mt-5 w-full text-center text-sm">
                        User not found!
                    </div>
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}
            {user && (
                <>
                    <div
                        onClick={handleSelect}
                        className="mt-5 flex items-center gap-4 rounded-xl hover:bg-[#2E343D] py-2 px-4 cursor-pointer"
                    >
                        <Avatar size="medium" user={user} />
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
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}
        </div>
    );
};

export default Search;
