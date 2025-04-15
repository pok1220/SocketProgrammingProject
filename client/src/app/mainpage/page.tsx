"use client"
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import GroupMenu from "../components/GroupMenu";
import { Action, CreateGroupResponse, GroupChat, Message, User, UserStatusResponse } from "../../../interface";
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
import { ChevronDown, ChevronUp, LogOut, MessageSquare } from "lucide-react";
import ChatPanel from "../components/ChatPanel";
import joinGroupChat from "@/libs/joinGroupChat";
import leaveGroupChat from "@/libs/leaveGroupChat";
import GroupList from "../components/GroupList";
import getGroupChat from "@/libs/getGroupChat";
import { set } from "zod";

export default function MainPage() {
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);//Handler Group From Other
  const [users, setUsers] = useState<User[]>([]);//Handler Display User Status
  const { data: session } = useSession();
  const userID = session?.user.id ?? ""
  const token = session?.user.token ?? ""
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const socket = useSocket();
  const [expandedGroup, setExpandedGroup] = useState("");
  const [selectedGroupChat, setSelectedGroupChat] = useState<GroupChat>();

  const toggleGroup = (group: string) => {
    if (expandedGroup === group) {
      setExpandedGroup("");
    } else {
      setExpandedGroup(group);
    }

  };

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
        // console.log("ALL USER",response)
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

    function onActionRoom(action: Action) { // Handler Group From Other
      console.log("receive action", action);
      const groupId = action.groupID;
      const actionType = action.action;
      const userId = action.userID;

      switch (actionType) {
        case "join":
          setGroupChats((prevGroupChats) =>
            prevGroupChats.map((groupChat) =>
              groupChat._id === groupId ? { ...groupChat, member: [...groupChat.member, userId] } : groupChat
            )
          );
          setSelectedGroupChat((prev) => {
            if (prev && prev._id === groupId) {
              return { ...prev, member: [...prev.member, userId] };
            }
            return prev;
          }
          );
          break;
        case "leave":
          setGroupChats((prevGroupChats) =>
            prevGroupChats.map((groupChat) =>
              groupChat._id === groupId ? { ...groupChat, member: groupChat.member.filter(member => member !== userId) } : groupChat
            )
          );
          setSelectedGroupChat((prev) => {
            if (prev && prev._id === groupId) {
              return { ...prev, member: prev.member.filter(member => member !== userId) };
            }
            return prev;
          }
          );
          break;
        default:
          break;
      }
    }


    socket?.on("receive_group", onReceiveGroup); // Handler Group From Other
    socket?.on("user_status", onStatus);//Handler Display User Status
    socket?.on("user_action_room", onActionRoom); // Handler Group From Other

    //Fetch Data in mount
    fetchGroupChats();
    fetchUsers()//Handler Display User Status

    return () => {
      socket?.off("receive_group", onReceiveGroup);
      socket?.off("user_status", onStatus);//Handler Display User Status
      socket?.off("user_action_room", onActionRoom); // Handler Group From Other
    };
  }, [session, socket]);

  useEffect(() => {
    const joinWorldChat = async () => {
      const worldChat = groupChats.find(g => g._id === "67fd2124444820f6576eb73a");

      if (worldChat && !worldChat.member.includes(userID)) {
        await joinGroup(worldChat, userID);
         // tell other user that you join group
         const action = {
          groupID: "67fd2124444820f6576eb73a",
          action: "join",
          userID: userID,
        }
        socket?.timeout(500).emit("action_room", action, () => {
          console.log("Another User Join Group");
        });
      }
    };

    if (userID && groupChats.length > 0) {
      joinWorldChat();
    }
  }, [userID, groupChats]);

  async function onCreateGroup(name: string, type: string, member: string[]) {
    const group: GroupChat = {
      message: [],
      name: name,
      member: member,
      type: type,
    };
    // Eject API
    const res: CreateGroupResponse = await createGroupChat(group, session?.user.token ?? "");
    console.log("CREATE GROUP", res)
    if (!res) {
      console.log("Error");
      return;
    }
    group._id = res.data._id
    // Emit Group that Creating
    socket?.timeout(5000).emit("create_room", group, () => {
      console.log("Create Group Emit Client");
    });

    setGroupChats((previous) => [...previous, group]);
    return group;
  }

  async function joinGroup(group: GroupChat, userID: string) {
    if (group._id === null || group._id === undefined) {
      console.log("Group ID is null or undefined");
      return;
    }

    group.member.push(userID);
    // Eject API
    const res = await joinGroupChat(group._id, userID, session?.user.token ?? "");
    console.log("JOIN GROUP", res)
    if (!res) {
      console.log("Error");
      return;
    }

    return group;
  }

  async function leaveGroup(group: GroupChat, userID: string) {
    if (group._id === null || group._id === undefined) {
      console.log("Group ID is null or undefined");
      return;
    }

    group.member = group.member.filter((member) => member !== userID);
    // Eject API
    const res = await leaveGroupChat(group._id, userID, session?.user.token ?? "");
    console.log("LEAVE GROUP", res)
    if (!res) {
      console.log("Error");
      return;
    }
    //group._id=res.data._id
    // Emit Group that Leaving
    socket?.timeout(5000).emit("leave_room", group._id, () => {
      console.log("Leave Group Emit Client");
    });

    const updatedGroupChats = groupChats.map(g =>
      g._id === group._id ? { ...g, member: [...group.member] } : g
    );
    setGroupChats(updatedGroupChats);

    return group;
  }

  async function requestGroupChat(groupID: string) {
    if(groupID == "") return;
    const groupChat = await getGroupChat(groupID);
    console.log("GROUP CHAT", groupChat);
    if (!groupChat) {
      console.log("Error to get group chat");
      return;
    }
    setSelectedGroupChat(groupChat);
  }

  const handleCreate = () => {
    onCreateGroup(name, "group", [userID]);
    setOpen(false);
    setName("");
  };

  const chatUser = async (userId: string) => {
    const sender = userID;
    let group = groupChats.find((group) => (group.type === "private" && group.member.includes(userId) && group.member.includes(sender)));
    if (group) {
      requestGroupChat(group._id || "");
      socket?.timeout(500).emit("join_room", group._id, () => {
        console.log("Join Group Emit Client");
      });
    }
    else {
      group = await onCreateGroup(userId, "private", [userId, sender]);
      if (group) {
        await requestGroupChat(group._id || "");
      }
    }
    if(group){
      localStorage.setItem("currentGroupId", group._id || "");
    }

  };

  async function chatGroup(group: GroupChat): Promise<void> {
    if (!group.member.includes(userID)) {
      const updatedGroup = await joinGroup(group, userID);
      if (updatedGroup) {
        group = updatedGroup;

        // tell other user that you join group
        const action = {
          groupID: group._id,
          action: "join",
          userID: userID,
        }
        socket?.timeout(500).emit("action_room", action, () => {
          console.log("Another User Join Group");
        });
      }
    }
    // console.log("THIS GROUP",group)
    socket?.timeout(500).emit("join_room", group._id, () => {
      console.log("Join Group Emit Client");
    });

    requestGroupChat(group._id || "");
    localStorage.setItem("currentGroupId", group._id || "");
  }

  async function handleLeaveGroup(group: GroupChat): Promise<void> {

    if (group.member.includes(userID)) {
      const updatedGroup = await leaveGroup(group, userID);
      if (updatedGroup) {
        group = updatedGroup;

        const action = {
          groupID: group._id,
          action: "leave",
          userID: userID,
        }
        // tell other user that you leave group
        socket?.timeout(500).emit("action_room", action, () => {
          console.log("Another User Join Group");
        });
      }
    }
    if (group._id === selectedGroupChat?._id) {
      setSelectedGroupChat(undefined);
    }
  }

  function addMessage(messsage: Message): void {
    console.log("ADD MESSAGE",messsage);
    const groupID = messsage.roomID;
    setGroupChats((prevGroupChats) =>
      prevGroupChats.map((groupChat) =>
        groupChat._id === groupID ? { ...groupChat, message: [...groupChat.message, messsage] } : groupChat
      )
    );

    if(selectedGroupChat && selectedGroupChat._id === groupID){
      setSelectedGroupChat((prev) => {
        if (prev) {
          return { ...prev, message: [...prev.message, messsage] };
        }
        return prev;
      });
    }
    // setGroupChats((prevGroupChats) =>
    //   prevGroupChats.map((groupChat) =>
    //     groupChat._id === groupID ? { ...groupChat, message: message } : groupChat
    //   )
    // );
    // if(selectedGroupChat && selectedGroupChat._id === groupID){
    //   setSelectedGroupChat((prev) => {
    //     if (prev) {
    //       return { ...prev, message: message };
    //     }
    //     return prev;
    //   });
    // }

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
                  <Button type="button" className="text-black border-2 border-black" onClick={() => { handleCreate() }}>
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

                {
                [
                  // ให้ World Chat มาอยู่บนสุด
                  ...groupChats.filter(g => g._id === "67fd2124444820f6576eb73a"),
                  // แล้วค่อยตามด้วยกลุ่มอื่น
                  ...groupChats.filter(g => (g.type === "group" && g._id !== "67fd2124444820f6576eb73a"))
                ].map((group, idx) => (
                  <GroupList
                    key={idx}
                    group={group}
                    userID={userID}
                    key_index={idx}
                    expandedGroup={expandedGroup}
                    handleLeaveGroup={handleLeaveGroup}
                    chatGroup={chatGroup}
                    toggleGroup={toggleGroup}
                    users={users}
                  />
                ))}
              </div>
            </div>

            {/* User Section */}
            <div>
              <h2 className="text-xl font-bold mb-2">User</h2>
              <div className="space-y-2">
                {users.map((user, idx) => (
                  user._id === userID ? "" :
                    <div
                      key={idx}
                      onClick={() => chatUser(user._id)}
                      className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${user.isOn
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
              groupChat={selectedGroupChat || null}
              users={users} 
              addMessage={addMessage}
            />
          </div>
        </div>
      </div>
    </main>

  );
}
