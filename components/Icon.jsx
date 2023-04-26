import React from "react";

const Icon = ({ size, icon, onClick }) => {
    let s = size === "small" ? 32 : size === "medium" ? 36 : 40;
    let c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : "w-10 h-10";

    return (
        <div
            className={`${c} rounded-full flex items-center justify-center hover:bg-[#121521] cursor-pointer`}
            onClick={onClick}
        >
            {icon && icon}
        </div>
    );
};

export default Icon;
