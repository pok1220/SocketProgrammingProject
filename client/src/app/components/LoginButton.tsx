"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import putUserStatus from "@/libs/putUserStatus";
import { useSocket } from "@/providers/SocketProvider"; // Adjust import if needed

const LoginButton = () => {
  const { data: session } = useSession();
  const socket = useSocket();
  const token = session?.user?.token ?? "";
  const userID = session?.user?.id ?? "";

  const handleLogout = async () => {
    try {
      if (token && userID) {
        socket?.emit("online", { userID, isOn: false });
        await putUserStatus(false, token, userID);
      }
    } catch (error) {
      console.error("Failed to update user status on logout:", error);
    } finally {
      signOut();
    }
  };

  return (
    <div className="ml-auto flex gap-2">
      {session?.user ? (
        <>
          <p className="text-sky-600">{session.user.name}</p>
          <button className="text-red-500" onClick={handleLogout}>
            Sign Out
          </button>
        </>
      ) : (
        <Link href="/auth/signIn" className="text-green-600">
          Login
        </Link>
      )}
    </div>
  );
};

export default LoginButton;
