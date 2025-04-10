import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NextAuthProvider from "@/providers/NextAuthProvider";
import AppBar from "./components/AppBar";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextAuthSession = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body 
      >
        <NextAuthProvider session={nextAuthSession}>
        <AppBar />
          {children}
        </NextAuthProvider>
        
      </body>
    </html>
  );
}
