import axios from "axios";
import {Message, MessageRequest } from "../../interface";

export default async function sendMessage(token:string,roomid:string,message:MessageRequest){
    // console.log("token",token,roomid)
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groupchat/message/${roomid}`;
    console.log(apiUrl)
    try {
        const response = await axios.put(apiUrl,message, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error(`Failed to send Message: ${response.status}`);
        };

        return response.data; 
    } catch (error: any) {
        console.error("Error send message", error.response || error.message || error);
        throw new Error("Error send message");
    }
}