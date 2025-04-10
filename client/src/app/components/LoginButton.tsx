"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const LoginButton = () => {
  const { data: session } = useSession();
  console.log("session",session)
  return (
    <div className="ml-auto flex gap-2">
      {session?.user ? (
        <>
          <p className="text-sky-600"> {session.user.name}</p>
          <button className="text-red-500" onClick={() => signOut()}>
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