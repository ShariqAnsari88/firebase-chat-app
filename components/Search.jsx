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
import { useAuth } from "@/firebase/authContext";
import { useChatContext } from "@/context/chatContext";
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
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
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
        <div>
            <input
                type="text"
                className="w-full outline-0 px-4 py-2 text-black"
                placeholder="Search user"
                onChange={(e) => setUsername(e.target.value)}
                onKeyUp={onKeyUp}
                value={username}
            />

            {err && <div>User not found!</div>}
            {user && (
                <div className="flex items-center gap-3" onClick={handleSelect}>
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                        <img
                            src={user.photoURL}
                            className="block w-full h-full object-cover object-center"
                        />
                    </div>
                    <span>{user.displayName}</span>
                </div>
            )}
        </div>
    );
};

export default Search;
