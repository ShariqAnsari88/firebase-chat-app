import React from "react";

const Navbar = () => {
    return (
        <div className="flex items-center justify-between">
            <div>Logo</div>
            <div className="flex items-center gap-2">
                <div>Username</div>
                <button>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;
