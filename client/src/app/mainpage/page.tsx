// "use client"
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import GroupMenu from "../components/GroupMenu";
import { SocketProvider } from "@/providers/SocketProvider";
export default function MainPage(){
    // const [isConnected, setIsConnected] = useState(false);
    // const [transport, setTransport] = useState("N/A");
    
    // useEffect(() => {
    //     if (socket.connected) {
    //       onConnect();
    //     }
    
    //     function onConnect() {
    //       setIsConnected(true);
    //       setTransport(socket.io.engine.transport.name);
    
    //       socket.io.engine.on("upgrade", (transport) => {
    //         setTransport(transport.name);
    //       });
    //     }
    
    //     function onDisconnect() {
    //       setIsConnected(false);
    //       setTransport("N/A");
    //     }
        
    //     const onUpgrade = (newTransport: any) => {
    //         setTransport(newTransport.name);
    //       };

    //     socket.on("connection", onConnect);
    //     socket.on("disconnect", onDisconnect);
    //     socket.io.engine.on("upgrade", onUpgrade);
    //     return () => {
    //       socket.off("connect", onConnect);
    //       socket.off("disconnect", onDisconnect);
    //       socket.io.engine.off("upgrade", onUpgrade);
    //     };
    //   }, []);
    return(
        <SocketProvider>
        <div className="flex bg-blue-200 justify-center min-h-screen">
        <div className="flex flex-col items-center sm:w-[70%] w-full my-12 px-6">
            <h1 className="text-3xl font-semibold mb-6 text-center">Click to Chat</h1>
            <div className="grid grid-cols-2 w-full">
                <div className="col-span-1"><GroupMenu/></div>
                 
            </div>
        </div>
        </div>
        </SocketProvider>
    )
}