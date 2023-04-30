import React from "react";
import Image from "next/image";
import useIsOnline from "@/hook/useIsOnline";

const Avatar = ({ size, user }) => {
    const { online } = useIsOnline(user?.uid);

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
    const f = size === "x-large" ? "text-2xl" : "text-base";
    return (
        <div
            className={`${c} rounded-full flex items-center justify-center text-base flex-shrink-0 relative`}
            style={{ backgroundColor: user.color }}
        >
            {online && (
                <>
                    {size === "large" && (
                        <span className="w-[10px] h-[10px] bg-green-500 rounded-full absolute bottom-[2px] right-[2px] " />
                    )}
                    {size === "x-large" && (
                        <span className="w-[12px] h-[12px] bg-green-500 rounded-full absolute bottom-[3px] right-[3px] " />
                    )}
                </>
            )}

            {user.photoURL ? (
                <div className={`${c} overflow-hidden rounded-full`}>
                    <Image
                        width={s}
                        height={s}
                        src={user.photoURL}
                        className="object-cover object-center w-full h-full"
                    />
                </div>
            ) : (
                <span className={`uppercase font-semibold ${f}`}>
                    {user.displayName?.charAt(0)}
                </span>
            )}
        </div>
    );
};

export default Avatar;
