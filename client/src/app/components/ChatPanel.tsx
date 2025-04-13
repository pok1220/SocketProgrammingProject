import { ExitIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import MessageBox from "./MessageBox";
import { GroupChat, Message } from "../../../interface";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { FormProvider } from "react-hook-form";
import { Input } from "./ui/input";

const mockGroupChat: GroupChat = {
    _id: "groupchat12345",
    name: "Work Meeting Group",
    type: "group",
    createdAt: "15 April 2025, 9:00 AM",
    member: [
      {
        _id: "1234567890abcdef12345678",
        name: "Alice",
        isOn: true,
      },
      {
        _id: "67f7f7ea563d46de1caf5321",
        name: "You",
        isOn: true,
      },
    ],
    message: [
      {
        text: "Hey, are you coming to the meeting later?",
        sendBy: {
          name: "Alice",
          isOn: true,
          _id: "1234567890abcdef12345678",
        },
        createdAt: "17 April 2568, 10:15 AM",
      },
      {
        text: "Yes, I'll be there in 10 minutes.",
        sendBy: {
          name: "You",
          isOn: true,
          _id: "67f7f7ea563d46de1caf5321",
        },
        createdAt: "17 April 2568, 10:16 AM",
      },
      {
        text: "Great! Don't forget to bring the documents.",
        sendBy: {
          name: "Alice",
          isOn: true,
          _id: "1234567890abcdef12345678",
        },
        createdAt: "7 April 2025, 10:17 AM",
      },
      {
        text: "Already packed. See you soon! Already packed. See you soon! Already packed. See you soon!",
        sendBy: {
          name: "You",
          isOn: true,
          _id: "67f7f7ea563d46de1caf5321",
        },
        createdAt: "7 April 2025, 10:18 AM",
      },
      {
        text: "Already packed. See you soon!",
        sendBy: {
          name: "You",
          isOn: true,
          _id: "67f7f7ea563d46de1caf5321",
        },
        createdAt: "17 April 2025, 10:18 AM",
      },
      {
        text: "Already packed. See you soon!",
        sendBy: {
          name: "You",
          isOn: true,
          _id: "67f7f7ea563d46de1caf5321",
        },
        createdAt: "13 April 2025, 10:18 AM",
      },
    ],
  };
  


export default function ChatPanel() {
    const formSchema = z.object({
      text: z
        .string()
        .trim()
        // .min(1, { message: "Description must be at least 1 character." })
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
  
    return (
      <FormProvider {...form}>
        <div className="flex flex-col w-full h-full">
          <div className="w-full h-[20%] flex items-center bg-gray-500 text-white font-bold rounded-sm px-6">
            <h1 className="text-3xl m-auto">{mockGroupChat.name} ({mockGroupChat.member.length})</h1>
            {mockGroupChat.type=="group"&&<ExitIcon className="w-5 h-5 hover:text-red-500 cursor-pointer" />}
          </div>
          <div className="w-full h-[70%] bg-amber-200 overflow-y-auto px-2 py-2">
            {mockGroupChat.message.map((message, index) => (
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
                        className={`w-5 h-5 hover:cursor-pointer ${
                            form.watch("text").length > 0 ? "hover:text-green-500" : "text-gray-500"
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