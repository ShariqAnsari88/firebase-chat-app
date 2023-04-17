import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyC3Vg4rUEC0xMc1zK9pnaHE75m78Fv4YxQ",
    authDomain: "chat-app-4dc43.firebaseapp.com",
    projectId: "chat-app-4dc43",
    storageBucket: "chat-app-4dc43.appspot.com",
    messagingSenderId: "397615249798",
    appId: "1:397615249798:web:8495a28da2fd35f024d407",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
