import React from "react";

const Input = () => {
    return (
        <div className="flex gap-5 justify-between items-center">
            <input
                type="text"
                className="w-full outline-0 px-4 py-2"
                placeholder="Message type here.."
            />
            <div className="flex shrink-0 gap-5">
                <input type="file" />
                <button>Send</button>
            </div>
        </div>
    );
};

export default Input;
