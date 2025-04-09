import { useState } from "react";
import { socket } from "../socket";

 export default function JoinRoom({roomEvent,room}:{roomEvent:Function,room:string}){
    // const [room, setRoom] = useState('1');
    const [isLoading, setIsLoading] = useState(false);
    
    function joinRoom() {
        setIsLoading(true)
       if(room!=""){
            socket.timeout(5000).emit("join_room",room,)
            setIsLoading(false);
        }
     }
    return(
        <>
            <input
                placeholder="Room Number"
                onChange={(event)=>{roomEvent(event.target.value)}}
                />
            <button disabled={isLoading} onClick={joinRoom}>Join Room</button>
        </>
    )
 }