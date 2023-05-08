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
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [editMsg, setEditMsg] = useState(null);
    const [isTyping, setIsTyping] = useState(null);
    const [imageViewer, setImageViewer] = useState(null);

    const resetFooterStates = () => {
        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);
        setEditMsg(null);
        setImageViewer(null);
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
                attachmentPreview,
                setAttachmentPreview,
                data: state,
                dispatch,
                editMsg,
                setEditMsg,
                isTyping,
                setIsTyping,
                resetFooterStates,
                imageViewer,
                setImageViewer,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
