import "@/styles/globals.css";
import { UserProvider } from "@/firebase/authContext";
import { ChatContextProvider } from "@/context/chatContext";
export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <ChatContextProvider>
                <Component {...pageProps} />
            </ChatContextProvider>
        </UserProvider>
    );
}
