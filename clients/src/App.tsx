// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { io } from 'socket.io-client'


// const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : 'http://localhost:8080';
// export const socket = io(URL, {
//     autoConnect: false
// });

// function App() {
 
//   const sendMessage=()=>{
//       socket.emit("send_message",{message:"Hello"}) //send situation
//   };
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//        <input placeholder="Message.."></input>
//        <button onClick={sendMessage}>Send Messagesss</button>
//     </div>
//   );
// }

// export default App


import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Event";
import { MyForm } from './components/MyForm';
import {FooEvent, Message} from '../interface'
import JoinRoom from './components/JoinRoom';

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<FooEvent[]>([]);
  const [room, setRoom] = useState('1');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value:FooEvent) {
      setFooEvents(previous => [...previous, value]);
    }

    function onSubmit(data: Message) {
      setFooEvents(previous => [
        ...previous,
        { message: data.message, timestamp: data.timestamp, by: "other" }
      ]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on("receive_message",onReceiveMessage)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('receive_message', onReceiveMessage);
    };
  }, []);

  // useEffect(()=>{
  //   socket.on("receive_message",(data:string)=>{
  //       alert(data.message)
  //   })
  // })


  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <JoinRoom roomEvent={setRoom} room={room}/>
      <MyForm fooEvent={setFooEvents} room={room}/>
    </div>
  );
}