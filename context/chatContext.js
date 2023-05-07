import {
    createContext,
    useContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { useAuth } from "@/context/authContext";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useAuth();

    const [users, setUsers] = useState(false);
    const [inputText, setInputText] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [editMsg, setEditMsg] = useState(null);
    const [isTyping, setIsTyping] = useState(null);

    const resetFooterStates = () => {
        setInputText("");
        setAttachment(null);
        setEditMsg(null);
    };

    const INITIAL_STATE = {
        chatId: "",
        user: null,
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider
            value={{
                users,
                setUsers,
                inputText,
                setInputText,
                attachment,
                setAttachment,
                data: state,
                dispatch,
                editMsg,
                setEditMsg,
                isTyping,
                setIsTyping,
                resetFooterStates,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
