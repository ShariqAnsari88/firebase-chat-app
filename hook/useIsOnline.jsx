import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const useIsOnline = (uid) => {
    const [online, setOnline] = useState(null);

    useEffect(() => {
        const docRef = doc(db, "users", uid);
        const unsub = onSnapshot(docRef, (doc) => {
            doc.exists() && setOnline(doc.data().isOnline);
        });
        return () => unsub();
    }, [uid]);

    return { online };
};

export default useIsOnline;
