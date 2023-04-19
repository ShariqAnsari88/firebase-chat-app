import React from "react";
import { useAuth } from "../firebase/authContext";
const Navbar = () => {
    const { signOut, currentUser } = useAuth();
    return (
        <div className="flex items-center justify-between">
            <div>Logo</div>
            <div className="flex items-center gap-2">
                <div>{currentUser.displayName}</div>
                <button onClick={signOut}>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;
