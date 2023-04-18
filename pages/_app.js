import "@/styles/globals.css";
import { UserProvider } from "@/firebase/authContext";
export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}
