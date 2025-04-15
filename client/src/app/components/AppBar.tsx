import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";

const AppBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-cyan-50 to-cyan-200 shadow-md z-50">
      <div className="mx-auto px-4 py-2 flex items-center justify-between">
        {/* Display the title */}
        <div className="text-xl font-semibold text-cyan-800">
          PokBoomOnline: RujAckzation
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center">
          <div className="mx-5">
            <Link href={"/"}>Home</Link>
          </div>
          <div className="">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBar;