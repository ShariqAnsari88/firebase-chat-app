import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = async () => {
        try {
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser?.uid), {
                    isOnline: false,
                });
            }
            setCurrentUser(null);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        console.log(user);
        if (!user) {
            clear();
            return;
        }

        const userDocExist = await getDoc(doc(db, "users", user.uid));
        if (userDocExist.exists()) {
            await updateDoc(doc(db, "users", user.uid), {
                isOnline: true,
            });
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));

        setCurrentUser(userDoc.data());
        setIsLoading(false);
    };

    const signOut = () => {
        authSignOut(auth).then(() => clear());
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{ currentUser, setCurrentUser, isLoading, signOut }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
