import { useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

import { useAuth } from "@/firebase/authContext";
import Loader from "@/components/Loader";

const Register = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push("/");
        }
    }, [currentUser, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(user);

            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);
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
                            await updateProfile(user, {
                                displayName,
                                photoURL: downloadURL,
                            });
                            console.log("File available at", downloadURL);

                            await setDoc(doc(db, "users", user.uid), {
                                uid: user.uid,
                                displayName,
                                email,
                                photoURL: downloadURL,
                            });

                            await setDoc(doc(db, "userChats", user.uid), {});

                            router.push("/");
                        }
                    );
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return isLoading || (!isLoading && !!currentUser) ? (
        <Loader />
    ) : (
        <div className="h-[100vh] flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 w-[350px] p-5 bg-gray-600"
            >
                <input
                    type="text"
                    placeholder="Display Name"
                    className="text-black"
                    autoComplete="off"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="text-black"
                    autoComplete="off"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="text-black"
                    autoComplete="off"
                />
                <input type="file" />
                <button>Sign Up</button>
            </form>
        </div>
    );
};

export default Register;
