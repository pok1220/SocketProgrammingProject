"use client"
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import GroupMenu from "../components/GroupMenu";
import { GroupChat, User, UserStatusResponse } from "../../../interface";
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
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const userID= session?.user.id??""
  const token =session?.user.token??""
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const fetchGroupChats = async () => {
        try {
          const response = await getGroupChats();
          setGroupChats(response);
        } catch (error) {
          console.error("Error fetching group chats:", error);
        }
    };

    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching group chats:", error);
      }
  };
  

    function onReceiveGroup(group: GroupChat) { //Handler Group From Other
    console.log("Hello Group from other")
      setGroupChats((previous) => [...previous, group]);
    }

    function onStatus(data: UserStatusResponse) {
      console.log("Hello Other Status");
    
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === data.userID ? { ...user, isOn: data.isOn } : user
        )
      );
    }

    socket?.on("receive_group", onReceiveGroup);
    socket?.on("user_status",onStatus);

    //Fetch Data in mount
    fetchGroupChats();
    fetchUsers()

    return () => {
      socket?.off("receive_group", onReceiveGroup);
      socket?.off("user_status",onStatus);
    };
  }, [session,socket]);


  
  async function onCreateGroup(name: string) {
    const group: GroupChat = {
      message: [],
      name: name,
      member:[userID],
      room: uuidv4(),
      type: "group",
    };
    // Eject API
    const res = await createGroupChat(group, session?.user.token ?? "");
    if (!res) {
      console.log("Error");
      return;
    }
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
    <div className="flex bg-blue-200 justify-center min-h-screen">
      <div className="flex flex-col items-center sm:w-[70%] w-full my-12 px-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Click to Chat</h1>
        <h2 className="text-black text-center">Connected: {socket?.id}</h2>
        <div className="grid grid-cols-2 w-full mt-5 gap-x-3">
          <div className="col-span-1 flex flex-col gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="m-auto">
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Group</DialogTitle>
                  <DialogDescription>
                    Make a group you want to join here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Group Name
                    </Label>
                    <Textarea
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" className="text-black border-2 border-black" onClick={() => {handleCreate()}}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <GroupMenu groups={groupChats} />
          </div>
          <div className="col-span-1">
              <PrivateMenu privates={users}/>
          </div>
        </div>
      </div>
    </div>
  );
}
