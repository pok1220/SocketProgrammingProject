"use client";
import Button from "@/app/components/ButtonLogin";
import TextBox from "@/app/components/ui/Textbox";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const LoginPage = () => {
  const router= useRouter()
  const email = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      email: email.current,
      password: pass.current,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      console.error("Login failed:", result.error);  // Log any errors that occur during login
    } else {
      console.log("Login successful:", result);
      router.push('/mainpage')
    }
  };
  return (
    <div
      className={
        "flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1 from-cyan-300 to-sky-600"
      }
    >
      <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
        <TextBox
          labelText="Email"
          className="text-black"
          onChange={(e) => (email.current = e.target.value)}
        />
        <TextBox
          labelText="Password"
          className="text-black"
          type={"password"}
          onChange={(e) => (pass.current = e.target.value)}
        />
        <Button onClick={onSubmit}>Login</Button>
        <span className="text-center"><Link className="text-black" href={'/auth/register'} >Register?</Link></span>
      </div>
    </div>
  );
};

export default LoginPage;