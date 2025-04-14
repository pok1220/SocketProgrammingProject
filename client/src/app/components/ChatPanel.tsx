"use client";
import { ExitIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import MessageBox from "./MessageBox";
import { GroupChat, Message, MessageRequest, User } from "../../../interface";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { FormProvider } from "react-hook-form";
import { Input } from "./ui/input";
import Button from "./ButtonLogin";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SendMessage from "@/libs/sendMessage";
import sendMessage from "@/libs/sendMessage";
import { useSocket } from "@/providers/SocketProvider";
import { all } from "axios";

  
export default function ChatPanel({
  groupChat,
  users,
  updateMessage,
}:{
  groupChat:GroupChat | null
  users: User[]
  updateMessage: (groupID:string, message: Message[]) => void
}) {
  if (!groupChat) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500">
        Select Chat
      </div>
    );
  }
  // console.log(groupChat)
    const formSchema = z.object({
      text: z
        .string()
        .trim()
        .max(1000, { message: "Description must not exceed 1000 characters." }),
    });
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        text: "",
      },
    });
    
    function onReceiveMessage(messsage: Message) { // Handler Message from Other
      console.log("Hello Message from other")
      const newMessage: Message[] = groupChat?.message || [];
      newMessage.push(messsage);
      console.log("New message", newMessage);
      if (groupChat && groupChat._id) {
        updateMessage(groupChat._id, newMessage);
      }
        //setAllMessage((previous) => [...previous, messsage]);
      }
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log("Form submitted:", values.text);
      const userData:User={
        _id:myUserID,
        isOn:true,
        name:session?.user.name??""
      }
      const messageData:MessageRequest={
        sendBy:myUserID,
        text:values.text,
        // createdAt:new Date().toDateString()
      }
      console.log(messageData)

      //Eject API Put
      const res= await sendMessage(token,groupChat?._id??"",messageData)
      if(!res){
          console.log("error")
      }
      const myMessageData:Message={
        roomID:groupChat?._id,
        sendBy:userData,
        text:values.text,
        createdAt:new Date().toString()
      }
      // console.log("MESSAGE",myMessageData)
      //Emit Data
      socket?.timeout(500).emit("create-something", myMessageData, () => {
          console.log("Create Group Emit Client");
      });

      const newMessage: Message[] = allMessage;
      newMessage.push(myMessageData);
      if (groupChat && groupChat._id) {
        updateMessage(groupChat._id, newMessage);
      }
      form.reset();
    }
    const socket = useSocket();
    const [allMessage,setAllMessage] = useState<Message[]>([])
    useEffect(() => {
        setAllMessage(groupChat?.message || []);
        socket?.on("receive_message",onReceiveMessage)
      }, [groupChat?.message]);

    const { data: session } = useSession();
    const token=session?.user.token??""
    const myUserID=session?.user.id??""
    return (
 
      <FormProvider {...form}>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-[20%] flex items-center bg-gray-500 text-white font-bold rounded-sm px-6">
            {groupChat.type=="group" ? 
              <h1 className="text-3xl m-auto">{groupChat.name} ({groupChat.member.length})</h1>
            :
            <h1 className="text-3xl m-auto">
             {(() => {
                const otherUserId = groupChat.member.find(id => id !== myUserID);
                const otherUser = users.find(user => user._id === otherUserId);
                return otherUser?.name || "Unknown User";
              })()}
            </h1>
            }
            
          </div>
          <div className="w-full h-[70%] bg-amber-200 overflow-y-auto px-2 py-2">
            {allMessage.map((message, index) => (
              <MessageBox key={index} message={message} />
            ))}
          </div>
          <div className="w-full h-[10%] bg-amber-500 px-2 py-2">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center space-x-2 h-full w-full m-auto justify-center "
            >
                <div className="w-[80%]">
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Textarea
                            className="w-full min-h-[30px] max-h-[40px] resize-none overflow-auto"
                            placeholder="Type your message"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage>
                        {form.formState.errors.text?.message}
                        </FormMessage>
                    </FormItem>
                    )}
                />
                </div>
                <div className="w-[10%]">
                <button
                    type="submit"
                    className="w-full h-full p-2  text-white rounded-full flex items-center justify-center"
                    disabled={form.watch("text")?.trim().length <= 0}
                >
                    <PaperPlaneIcon
                    className={`w-5 h-5 ${
                        form.watch("text")?.trim().length > 0
                        ? "hover:cursor-pointer hover:text-green-500"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                    />
                </button>
                </div>
            </form>
            </div>
        </div>
      </FormProvider>
    );
  }