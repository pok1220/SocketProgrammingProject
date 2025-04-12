"use client"
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import GroupMenu from "../components/GroupMenu";
import { CreateGroupResponse, GroupChat, User, UserStatusResponse } from "../../../interface";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/Button";
import { DialogFooter, DialogHeader } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "@radix-ui/react-label";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "../components/ui/textarea";
import createGroupChat from "@/libs/createGroupChat";
import getGroupChats from "@/libs/getGroupChats";
import PrivateMenu from "../components/PrivateChat";
import getUsers from "@/libs/getUsers";

export default function MainPage() {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);//Handler Group From Other
  const [users, setUsers] = useState<User[]>([]);//Handler Display User Status
  const { data: session } = useSession();
  const userID= session?.user.id??""
  const token =session?.user.token??""
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const fetchGroupChats = async () => { //Handler Group From Other
        try {
          const response = await getGroupChats();
          setGroupChats(response);
        } catch (error) {
          console.error("Error fetching group chats:", error);
        }
    };

    const fetchUsers = async () => { //Handler Display User Status
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching group chats:", error);
      }
  };
  

    function onReceiveGroup(group: GroupChat) { // Handler Group From Other
    console.log("Hello Group from other")
      setGroupChats((previous) => [...previous, group]);
    }

    function onStatus(data: UserStatusResponse) { // Handler Display User Status
      console.log("Hello Other Status");
    
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === data.userID ? { ...user, isOn: data.isOn } : user
        )
      );
    }

    socket?.on("receive_group", onReceiveGroup); // Handler Group From Other
    socket?.on("user_status",onStatus);//Handler Display User Status

    //Fetch Data in mount
    fetchGroupChats();
    fetchUsers()//Handler Display User Status

    return () => {
      socket?.off("receive_group", onReceiveGroup);
      socket?.off("user_status",onStatus);//Handler Display User Status
    };
  }, [session,socket]);


  
  async function onCreateGroup(name: string) {
    const group: GroupChat = {
      message: [],
      name: name,
      member:[userID],
      type: "group",
    };
    // Eject API
    const res:CreateGroupResponse = await createGroupChat(group, session?.user.token ?? "");
    console.log("CREATE GROUP",res)
    if (!res) {
      console.log("Error");
      return;
    }
    group._id=res.data._id
    // Emit Group that Creating
    socket?.timeout(5000).emit("create_room", group, () => {
      console.log("Create Group Emit Client");
    });
    setGroupChats((previous) => [...previous, group]);
  }


  const handleCreate = () => {
    onCreateGroup(name);   
    setOpen(false);        
    setName("");           
  };

  return (
    <div className="flex bg-blue-200 justify-center min-h-screen w-full h-full mx-0">
      <div className="flex flex-col w-[100%] my-12 px-2">
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 w-full h-[500px] mt-5 gap-x-3 gap-y-10">
          <div className="sm:col-span-3 lg:col-span-2 bg-white p-4 rounded shadow w-full h-full">
          
          </div>
          <div className="sm:col-span-3 lg:col-span-3 bg-white p-4 rounded shadow w-full h-full">
          
          </div>
        </div>
      </div>
    </div>

  );
}
