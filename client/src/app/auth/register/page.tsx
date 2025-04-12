"use client";
import Button from "@/app/components/ButtonLogin";
import TextBox from "@/app/components/ui/Textbox";
import { signIn } from "next-auth/react";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/libs/register";


const RegisterPage = () => {
  const router= useRouter()
  const [email,setEmail] = useState<string>("")
  const [pass,setPass] = useState<string>("")
  const [name,setName] = useState<string>("")

  const onSubmit = async () => {

    const res = await register({name:name,email:email,password:pass})
    if (!res.data){
        console.log("error")
        return;
    }

    const result = await signIn("credentials", {
      email: email ,
      password: pass,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      console.error("Login failed:", result.error);  // Log any errors that occur during login
    } else {
      console.log("Login successful:", result);
      router.push('/')
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
          labelText="Name"
          className="text-black"
          onChange={(e) => {setName(e.target.value)}}
        />
        <TextBox
          labelText="Email"
          className="text-black"
          onChange={(e) => {setEmail(e.target.value)}}
        />
        <TextBox
          labelText="Password"
          className="text-black"
          type={"password"}
          onChange={(e) => {setPass(e.target.value)}}
        />
        <Button onClick={onSubmit}>Register</Button>
      </div>
    </div>
  );
};

export default RegisterPage;
 
