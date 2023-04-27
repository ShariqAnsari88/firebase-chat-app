import React from "react";

const Icon = ({ size, icon, onClick }) => {
    let c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : size === "large"
            ? "w-10 h-10"
            : "w-14 h-14";

    return (
        <div
            className={`${c} rounded-3xl flex items-center justify-center hover:bg-[#2e333d] cursor-pointer`}
            onClick={onClick}
        >
            {icon && icon}
        </div>
    );
};

export default Icon;
