import React, { useEffect, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";
import { DELETED_FOR_ME, DELETED_FOR_EVERYONE } from "@/utils/constants";

const Menu = ({ self, setShowMenu, showMenu, deleteMessage }) => {
    const ref = useRef();

    useEffect(() => {
        ref?.current?.scrollIntoViewIfNeeded();
    }, [showMenu]);

    const handleClickAway = () => {
        setShowMenu(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                ref={ref}
                className={`w-[200px] absolute top-8 bg-[#101010] z-10 rounded-md overflow-hidden ${
                    self ? "right-0" : "left-0"
                }`}
            >
                <ul className="flex flex-col py-2">
                    <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">
                        Edit message
                    </li>
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(DELETED_FOR_ME);
                        }}
                    >
                        Delete message
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default Menu;