import { useSession } from "next-auth/react";
import { Message } from "../../../interface";

function formatSmartDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
  
    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    const isSameYear = date.getFullYear() === now.getFullYear();
  
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear() 
  
    if (isSameDay) {
      return time;
    } else if (isSameYear) {
      return `${day} ${month} ${time}`;
    } else {
      return `${day} ${month} ${year} ${time}`;
    }
  }



export default function MessageBox({message}:{message:Message}) {
    const { data: session } = useSession();
    const userID= session?.user.id??""
    const isSelf = message.sendBy._id === userID; 
  const formattedDate = formatSmartDate(message.createdAt);
  const messageColor= isSelf?"bg-green-500":"bg-amber-300"

  return (
<div className={`w-full flex ${isSelf ? "flex-row-reverse" : "flex-row"} items-end gap-x-2 p-2`}>
  <div className="flex flex-col max-w-[50%] break-words">
    {!isSelf && (
      <span className="text-xs font-bold text-gray-700 mb-1">
        {message.sendBy.name}
      </span>
    )}
    <span className={` ${messageColor}  p-3 break-words rounded-2xl`}>
    {message.text}
    </span>
  </div>
  <div className="text-sm text-gray-600 text-right content-center">
    {formattedDate}  
  </div>
</div>

  );
}