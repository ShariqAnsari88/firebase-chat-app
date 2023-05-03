import {
    createContext,
    useContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { useAuth } from "@/firebase/authContext";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [editMsg, setEditMsg] = useState(null);
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
            value={{ data: state, dispatch, editMsg, setEditMsg }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
