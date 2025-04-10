"use client"
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


let socket:any;

const SocketProvider = ({ children }:{children:React.ReactNode}) => {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.token) {
      const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8080';

      // Create a socket connection once the session is available
      console.log("sessionss",session.user.token)
      socket = io(URL, {
        auth: {
          token: session.user.token,
        },
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      return () => {
        // Clean up the socket connection when the component is unmounted
        socket.disconnect();
      };
    }
  }, [session, status]);

  // You can now pass down `socket` and `isConnected` through context or props
  return (
    <div>
      {children}
    </div>
  );
};

export { SocketProvider, socket };
