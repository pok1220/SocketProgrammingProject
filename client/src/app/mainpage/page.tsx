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
import { ChevronDown, LogOut, MessageSquare } from "lucide-react";
import ChatPanel from "../components/ChatPanel";
import joinGroupChat from "@/libs/joinGroupChat";
import leaveGroupChat from "@/libs/leaveGroupChat";

export default function MainPage() {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);//Handler Group From Other
  const [users, setUsers] = useState<User[]>([]);//Handler Display User Status
  const { data: session } = useSession();
  const userID= session?.user.id??""
  const token =session?.user.token??""
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const socket = useSocket();
  const [expandedGroup, setExpandedGroup] = useState("");
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupChat>();

  const toggleGroup = (group: string) => {
    setExpandedGroup(group);
  };

  // const mockGroupChat: GroupChat = {
  //   _id: "groupchat12345",
  //   name: "Work Meeting Group",
  //   type: "group",
  //   createdAt: "15 April 2025, 9:00 AM",
  //   member: [
  //     {
  //       _id: "1234567890abcdef12345678",
  //       name: "Alice",
  //       isOn: true,
  //     },
  //     {
  //       _id: "67f7f7ea563d46de1caf5321",
  //       name: "You",
  //       isOn: true,
  //     },
  //   ],
  //   message: [
  //     {
  //       text: "Hey, are you coming to the meeting later?",
  //       sendBy: {
  //         name: "Alice",
  //         isOn: true,
  //         _id: "1234567890abcdef12345678",
  //       },
  //       createdAt: "17 April 2568, 10:15 AM",
  //     },
  //     {
  //       text: "Yes, I'll be there in 10 minutes.",
  //       sendBy: {
  //         name: "You",
  //         isOn: true,
  //         _id: "67f7f7ea563d46de1caf5321",
  //       },
  //       createdAt: "17 April 2568, 10:16 AM",
  //     },
  //     {
  //       text: "Great! Don't forget to bring the documents.",
  //       sendBy: {
  //         name: "Alice",
  //         isOn: true,
  //         _id: "1234567890abcdef12345678",
  //       },
  //       createdAt: "7 April 2025, 10:17 AM",
  //     },
  //     {
  //       text: "Already packed. See you soon! Already packed. See you soon! Already packed. See you soon!",
  //       sendBy: {
  //         name: "You",
  //         isOn: true,
  //         _id: "67f7f7ea563d46de1caf5321",
  //       },
  //       createdAt: "7 April 2025, 10:18 AM",
  //     },
  //     {
  //       text: "Already packed. See you soon!",
  //       sendBy: {
  //         name: "You",
  //         isOn: true,
  //         _id: "67f7f7ea563d46de1caf5321",
  //       },
  //       createdAt: "17 April 2025, 10:18 AM",
  //     },
  //     {
  //       text: "Already packed. See you soon!",
  //       sendBy: {
  //         name: "You",
  //         isOn: true,
  //         _id: "67f7f7ea563d46de1caf5321",
  //       },
  //       createdAt: "13 April 2025, 10:18 AM",
  //     },
  //   ],
  // };

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

  async function joinGroup(group: GroupChat, userID: string) {
    if(group._id === null || group._id === undefined){
      console.log("Group ID is null or undefined");
      return;
    }
    
    group.member.push(userID);
    // Eject API
    const res = await joinGroupChat(group._id, userID, session?.user.token ?? "");
    console.log("JOIN GROUP",res)
    if (!res) {
      console.log("Error");
      return;
    }
    //group._id=res.data._id
    // Emit Group that Joining
    socket?.timeout(5000).emit("join_room", group, () => {
      console.log("Join Group Emit Client");
    });

    return group;
  }

  async function leaveGroup(group: GroupChat, userID: string) {
    if(group._id === null || group._id === undefined){
      console.log("Group ID is null or undefined");
      return;
    }

    group.member = group.member.filter((member) => member !== userID);
    // Eject API
    const res = await leaveGroupChat(group._id, userID, session?.user.token ?? "");
    console.log("LEAVE GROUP",res)
    if (!res) {
      console.log("Error");
      return;
    }
    //group._id=res.data._id
    // Emit Group that Leaving
    socket?.timeout(5000).emit("leave_room", group, () => {
      console.log("Leave Group Emit Client");
    });

    const newGroupChat : GroupChat[] = groupChats;
    newGroupChat.forEach((g, index) => {
      if (g._id === group._id) {
        groupChats[index] = group;
      }
    });
    setGroupChats(newGroupChat);
    console.log("Group Chats", newGroupChat);
    return group;
  }

  const handleCreate = () => {
    onCreateGroup(name);   
    setOpen(false);        
    setName("");           
  };

  const chatUser = (userId : string) => {

  };

  async function chatGroup(group: GroupChat): Promise<void> {
    if (!group.member.includes(userID)) {
      const updatedGroup = await joinGroup(group, userID);
      if (updatedGroup) {
        group = updatedGroup;
      }
    }

    setSelectedGroupChat(group);
  }

  async function handleLeaveGroup(group: GroupChat): Promise<void> {
    
    if (group.member.includes(userID)) {
      const updatedGroup = await leaveGroup(group, userID);
      if (updatedGroup) {
        group = updatedGroup;
      }
    }
    setSelectedGroupChat(undefined);

  }

  return (
    <main className="flex bg-blue-200 justify-center min-h-screen w-full h-full mx-0">
    <div className="flex flex-col w-[100%] h-[100%] my-12 px-2 m-auto">
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 w-full h-[620px] mt-5 gap-x-3 gap-y-10">
        <div className="sm:col-span-3 lg:col-span-2  overflow-y-auto bg-white p-4 rounded shadow w-full h-full">
            {/* Group Section */}
            <Dialog open={open} onOpenChange={setOpen}>
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
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Group</h2>
                <button 
                  className="text-xl font-bold"
                  onClick={() => setOpen(true)}
                >+</button>
              </div>
              <div className="space-y-2">
                {groupChats.map((group, i) => (
                  <div key={i} className="bg-gray-200 rounded">
                    <div className="flex justify-between items-center px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👥</span>
                        <span>{group.name} ({group.member.length})</span>
                      </div>
                      <div className="flex gap-2">
                        {/* 👇 Leave Group button shows only if user is in group*/}
                        {group.member.includes(userID) && (
                          <LogOut
                            onClick={() => handleLeaveGroup(group)}
                            className="w-5 h-5 text-red-500 cursor-pointer"
                          />
                        )} 
                        <MessageSquare 
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => chatGroup(group)}
                         />
                        <ChevronDown
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => toggleGroup(group.name)}
                        />
                      </div>
                    </div>
                    {expandedGroup === group.name && (
                      <div className="pl-10 pb-2 space-y-1">
                        {group.member.map((member, idx) => (
                          <div key={idx} className="text-sm text-gray-700">
                            • {users.find(user => user._id === String(member))?.name || member.toString()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* User Section */}
            <div>
              <h2 className="text-xl font-bold mb-2">User</h2>
              <div className="space-y-2">
                {users.map((user, idx) => (
                  <div
                  key={idx}
                  onClick={() => chatUser(user._id)}
                  className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
                >
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        user.isOn
                          ? "border-green-500"
                          : "border-black"
                      } flex items-center justify-center`}
                    >
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sm:col-span-3 lg:col-span-3  overflow-y-auto bg-white p-0 rounded shadow w-full h-full">
            <ChatPanel
              groupChat={selectedGroupChat}
            />
          </div>
        </div>
      </div>
    </main>

  );
}
