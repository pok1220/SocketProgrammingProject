"use client";
import { ExitIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import MessageBox from "./MessageBox";
import { GroupChat, Message, User } from "../../../interface";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { FormProvider } from "react-hook-form";
import { Input } from "./ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert";
import Button from "./ButtonLogin";
import { useEffect, useState } from "react";

  
export default function ChatPanel({
  groupChat,
  users
}:{
  groupChat:GroupChat | null
  users: User[]
}) {
  if (!groupChat) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500">
        Select Chat
      </div>
    );
  }

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
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
       if(values.text.length)
      console.log("Form submitted:", values.text);
    }
    
    const [allMessage,setAllMessage] = useState<Message[]>([])
    useEffect(() => {
        setAllMessage(groupChat?.message || []);
      }, [groupChat?.message]);

    return (
 
      <FormProvider {...form}>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-[20%] flex items-center bg-gray-500 text-white font-bold rounded-sm px-6">
            {groupChat.type=="group" ? 
              <h1 className="text-3xl m-auto">{groupChat.name} ({groupChat.member.length})</h1>
            :
            <h1 className="text-3xl m-auto">
              {users.find(user => user._id === groupChat.name)?.name || "Unknown User"}
            </h1>
            }
            
            {groupChat.type=="group"&&
            
            <AlertDialog>
                {/* <AlertDialogTrigger><ExitIcon className="w-5 h-5 hover:text-red-500 cursor-pointer" /></AlertDialogTrigger> */}
                            <AlertDialogContent className="max-w-lg rounded-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold mb-2">
                        Are you sure to leave this group chat?
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild className="text-red">
                            Your message will be delete permanently.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-black">
                        cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700 text-white"
                        asChild
                        >
                        <Button>
                            confirm
                        </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>}
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