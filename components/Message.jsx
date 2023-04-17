import React from "react";

const Message = (props) => {
    return (
        <div
            className={`flex gap-5 ${
                props.self ? "justify-start flex-row-reverse" : ""
            }`}
        >
            <div className="flex flex-col">
                <div>username</div>
                <div>date & time</div>
            </div>
            <div
                className={`flex flex-col gap-4 p-4 ${
                    props.self ? "bg-blue-900" : "bg-slate-900"
                }`}
            >
                <div>img</div>
                <div>message</div>
            </div>
        </div>
    );
};

export default Message;
