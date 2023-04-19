import {
    createContext,
    useContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { useAuth } from "@/firebase/authContext";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const INITIAL_STATE = {
        chatId: "",
        user: {},
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
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
