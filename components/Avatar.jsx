import Image from "next/image";
import React from "react";

const Avatar = ({ size, user }) => {
    const s =
        size === "small"
            ? 32
            : size === "medium"
            ? 36
            : size === "x-large"
            ? 56
            : 40;
    const c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : size === "large"
            ? "w-10 h-10"
            : "w-14 h-14";
    return (
        <div
            className={`${c} rounded-2xl overflow-hidden flex items-center justify-center text-base flex-shrink-0`}
            style={{ backgroundColor: user.color }}
        >
            {user.photoURL ? (
                <Image
                    width={s}
                    height={s}
                    src={user.photoURL}
                    className="object-cover object-center w-full h-full"
                />
            ) : (
                <span className="uppercase font-semibold">
                    {user.displayName.charAt(0)}
                </span>
            )}
        </div>
    );
};

export default Avatar;
