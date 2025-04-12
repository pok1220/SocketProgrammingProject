import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { SocketProvider } from "@/providers/SocketProvider";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (

         <SocketProvider> {children}</SocketProvider>
        
  );
}
