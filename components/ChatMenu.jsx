import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ setShowMenu, showMenu }) => {
    const handleClickAway = () => {
        setShowMenu(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div
                className={`w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden`}
            >
                <ul className="flex flex-col py-2">
                    {self && (
                        <li
                            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                            }}
                        >
                            Block user
                        </li>
                    )}
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                        }}
                    >
                        Delete chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default ChatMenu;
