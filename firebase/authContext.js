import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const clear = () => {
        setCurrentUser(null);
        setIsLoading(false);
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        console.log(user);
        if (!user) {
            clear();
            return;
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
        <UserContext.Provider value={{ currentUser, isLoading, signOut }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
