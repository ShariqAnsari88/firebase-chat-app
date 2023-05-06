import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import Avatar from "./Avatar";
import Icon from "./Icon";

import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { BiCheck, BiEdit } from "react-icons/bi";
import { MdAddAPhoto, MdPhotoCamera, MdDeleteForever } from "react-icons/md";
import UsersPopup from "./popup/UsersPopup";
import { profileColors } from "@/utils/constants";

const LeftNav = () => {
    const [userPopup, setUserPopup] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const { signOut, currentUser } = useAuth();

    const editProfileContainer = () => {
        return (
            <div className="flex flex-col items-center relative">
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
                        {currentUser.photoURL ? (
                            <MdPhotoCamera size={34} />
                        ) : (
                            <MdAddAPhoto size={34} />
                        )}
                    </div>

                    {currentUser.photoURL && (
                        <div className="w-8 h-8 rounded-full bg-black flex justify-center items-center absolute right-0 bottom-0">
                            <MdDeleteForever />
                        </div>
                    )}
                </div>
                <div className="mt-5 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <BiEdit color="#8B8D93" />
                        <div
                            contentEditable
                            className="bg-transparent outline-none border-none text-center"
                            type="text"
                            id="displayNameEdit"
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
