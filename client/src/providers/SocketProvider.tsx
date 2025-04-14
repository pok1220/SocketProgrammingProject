// app/providers/SocketProvider.tsx
"use client";

import putUserStatus from "@/libs/putUserStatus";
import { useSession } from "next-auth/react";
import { useEffect, useState, createContext, useContext } from "react";
import {UserStatusResponse} from "../../interface"
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const token=session?.user.token??""
  const userID=session?.user.id??""
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      const URL =
        process.env.NODE_ENV === "production"
          ? "https://your-production-url"
          : "http://localhost:8080";

      const socketInstance = io(URL, {
        auth: {
          token: session.user.token,
        },
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setSocket(socketInstance);
        const data:UserStatusResponse={userID:userID,isOn:true}
        socketInstance.emit("online",data)

        const joinRoom = localStorage.getItem("currentGroupId") || "";
        console.log("Join room:", joinRoom);
        if(joinRoom != ""){
          socketInstance.emit("join_room", joinRoom);
        }

        const res=putUserStatus(true,token,userID)
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocket(null);
      });

      // Handle tab close or page refresh
      const handleBeforeUnload = () => {
        if (socketInstance?.connected) {
          // Emit offline status before unloading
          const data: UserStatusResponse = { userID, isOn: false };
          socketInstance.emit("online", data);
          putUserStatus(false, token, userID);
          socketInstance.disconnect();
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socketInstance.disconnect();
      };
    }
  }, [session, status]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
