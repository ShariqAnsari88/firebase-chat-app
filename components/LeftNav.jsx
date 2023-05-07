import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import Avatar from "./Avatar";
import Icon from "./Icon";

import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { BiCheck, BiEdit } from "react-icons/bi";
import { MdAddAPhoto, MdPhotoCamera, MdDeleteForever } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";

import UsersPopup from "./popup/UsersPopup";
import { profileColors } from "@/utils/constants";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "@/firebase/firebase";
import { useChatContext } from "@/context/chatContext";
import ToastMessage from "./ToastMessage";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const LeftNav = () => {
    const [userPopup, setUserPopup] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [nameEdited, setNameEdited] = useState(false);

    const { signOut, currentUser, setCurrentUser } = useAuth();
    const { data } = useChatContext();

    const authUser = auth.currentUser;

    const handleUpdateProfile = async (type, value) => {
        let obj = { ...currentUser };
        switch (type) {
            case "color":
                obj.color = value;
                break;
            case "name":
                obj.displayName = value;
                break;
            case "photo":
                obj.photoURL = value;
                break;
            case "photo-remove":
                obj.photoURL = null;
                break;
            default:
                break;
        }

        try {
            toast.promise(
                async () => {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    await updateDoc(userDocRef, obj);
                    setCurrentUser(obj);

                    if ("photo-remove") {
                        await updateProfile(authUser, {
                            photoURL: null,
                        });
                    }

                    if (type === "name") {
                        await updateProfile(authUser, {
                            displayName: value,
                        });
                        setNameEdited(false);
                    }
                },
                {
                    pending: "Updating profile.",
                    success: "Profile updated successfully.",
                    error: "Profile udpate failed.",
                },
                {
                    autoClose: 3000,
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const uploadImageToFirebase = async (file) => {
        try {
            if (file) {
                const storageRef = ref(storage, currentUser.displayName);
                const uploadTask = uploadBytesResumable(storageRef, file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {},
                    (error) => {
                        console.error(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            async (downloadURL) => {
                                handleUpdateProfile("photo", downloadURL);
                                await updateProfile(authUser, {
                                    photoURL: downloadURL,
                                });
                            }
                        );
                    }
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onkeyup = (event) => {
        if (event.target.innerText.trim() !== currentUser.displayName) {
            setNameEdited(true);
        } else {
            setNameEdited(false);
        }
    };
    const onkeyDown = (event) => {
        if (event.key === "Enter" && event.keyCode === 13)
            event.preventDefault();
    };

    const editProfileContainer = () => {
        return (
            <div className="flex flex-col items-center relative">
                <ToastMessage />
                <Icon
                    size="small"
                    className="absolute top-0 right-5"
                    icon={<IoClose size={20} />}
                    onClick={() => setEditProfile(false)}
                />
                <div className="relative group cursor-pointer">
                    <Avatar
                        size="xx-large"
                        user={currentUser}
                        onClick={() => setEditProfile(true)}
                    />
                    <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
                        <label htmlFor="fileUpload">
                            {currentUser.photoURL ? (
                                <MdPhotoCamera size={34} />
                            ) : (
                                <MdAddAPhoto size={34} />
                            )}
                        </label>
                        <input
                            id="fileUpload"
                            type="file"
                            onChange={(e) =>
                                uploadImageToFirebase(e.target.files[0])
                            }
                            style={{ display: "none" }}
                        />
                    </div>

                    {currentUser.photoURL && (
                        <div
                            className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0"
                            onClick={() => handleUpdateProfile("photo-remove")}
                        >
                            <MdDeleteForever size={14} />
                        </div>
                    )}
                </div>
                <div className="mt-5 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        {!nameEdited && <BiEdit color="#8B8D93" />}
                        {nameEdited && (
                            <BsFillCheckCircleFill
                                className="cursor-pointer"
                                color="#6b8afd"
                                onClick={() =>
                                    handleUpdateProfile(
                                        "name",
                                        document.getElementById(
                                            "displayNameEdit"
                                        ).innerText
                                    )
                                }
                            />
                        )}
                        <div
                            contentEditable
                            className="bg-transparent outline-none border-none text-center"
                            type="text"
                            id="displayNameEdit"
                            onKeyUp={onkeyup}
                            onKeyDown={onkeyDown}
                        >
                            {currentUser.displayName}
                        </div>
                    </div>
                    <span className="text-[#8B8D93] text-sm">
                        {currentUser.email}
                    </span>
                </div>
                <div className="grid grid-cols-5 gap-4 mt-5">
                    {profileColors.map((color, index) => (
                        <span
                            key={index}
                            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                            style={{ backgroundColor: color }}
                            onClick={() => handleUpdateProfile("color", color)}
                        >
                            {color === currentUser.color && (
                                <BiCheck size={24} />
                            )}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${
                editProfile ? "w-[400px]" : "w-[80px] items-center"
            } flex flex-col justify-between py-5 shrink-0 transition-all`}
        >
            {editProfile ? (
                editProfileContainer()
            ) : (
                <>
                    {currentUser && (
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => setEditProfile(true)}
                        >
                            <Avatar size="large" user={currentUser} />
                            <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
                                <BiEdit size={14} />
                            </div>
                        </div>
                    )}
                </>
            )}

            <div
                className={`flex  gap-5 ${
                    editProfile ? "ml-5" : "flex-col items-center"
                }`}
            >
                <Icon
                    size="x-large"
                    className="bg-green-500 hover:bg-green-600"
                    icon={<FiPlus size={24} />}
                    onClick={() => setUserPopup(!userPopup)}
                />
                <Icon
                    size="x-large"
                    icon={<IoLogOutOutline size={24} />}
                    onClick={signOut}
                />
            </div>

            {userPopup && <UsersPopup onHide={() => setUserPopup(false)} />}
        </div>
    );
};

export default LeftNav;
