import React, { useState, useEffect } from "react";
import { useChatContext } from "@/context/chatContext";

import Icon from "./Icon";
import { CgAttachment } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { HiOutlineEmojiHappy } from "react-icons/hi";

import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import Composebar from "./Composebar";

const ChatFooter = () => {
    const [showImojiPicker, setShowImojiPicker] = useState(false);

    const { inputText, setInputText, data, editMsg, setEditMsg, isTyping } =
        useChatContext();

    useEffect(() => {
        setInputText(editMsg?.text || "");
    }, [editMsg]);

    const onEmojiClick = (emojiData, event) => {
        console.log(emojiData, event);
        let text = inputText;
        setInputText((text += emojiData.emoji));
    };

    return (
        <div className="flex items-center bg-[#131313]/[0.5] p-2 rounded-xl relative">
            <div className="shrink-0">
                <input
                    type="file"
                    id="fileUploader"
                    className="hidden"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="fileUploader">
                    <Icon
                        size="large"
                        icon={<CgAttachment size={20} color="#8B8D93" />}
                    />
                </label>
            </div>

            <div className="shrink-0 relative">
                <Icon
                    size="large"
                    className={`${showImojiPicker ? "bg-[#2E343D]" : ""}`}
                    icon={<HiOutlineEmojiHappy size={24} color="#8B8D93" />}
                    onClick={() => setShowImojiPicker(true)}
                />
                {showImojiPicker && (
                    <ClickAwayListener
                        onClickAway={() => setShowImojiPicker(false)}
                    >
                        <div className="absolute bottom-12 left-0 shadow-lg">
                            <EmojiPicker
                                emojiStyle="native"
                                theme="light"
                                onEmojiClick={onEmojiClick}
                                autoFocusSearch={false}
                            />
                        </div>
                    </ClickAwayListener>
                )}
            </div>

            {isTyping && (
                <div className="absolute -top-6 left-4 bg-[#202329] w-full h-6">
                    <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
                        {`${data.user.displayName} is typing`}
                        <img src="/typing.svg" />
                    </div>
                </div>
            )}

            {editMsg && (
                <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#6b8afd] flex items-center gap-2 py-2 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg"
                    onClick={() => setEditMsg(null)}
                >
                    <span>Cancel edit</span>
                    <IoClose size={20} color="#fff" />
                </div>
            )}

            <Composebar />
        </div>
    );
};

export default ChatFooter;
