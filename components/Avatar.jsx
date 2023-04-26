import Image from "next/image";
import React from "react";

const Avatar = ({ size, user }) => {
    let s = size === "small" ? 32 : size === "medium" ? 36 : 40;
    let c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : "w-10 h-10";

    return (
        <div
            className={`${c} rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-base`}
        >
            {user.photoURL ? (
                <Image
                    width={s}
                    height={s}
                    src={user.photoURL}
                    className="object-cover object-center w-full h-full"
                />
            ) : (
                user.displayName.charAt(0)
            )}
        </div>
    );
};

export default Avatar;
