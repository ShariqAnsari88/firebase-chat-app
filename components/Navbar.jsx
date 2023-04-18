import React from "react";
import { useAuth } from "../firebase/authContext";
const Navbar = () => {
    const { signOut } = useAuth();
    return (
        <div className="flex items-center justify-between">
            <div>Logo</div>
            <div className="flex items-center gap-2">
                <div>Username</div>
                <button onClick={signOut}>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;
