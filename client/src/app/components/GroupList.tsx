import { ChevronDown, ChevronUp, LogOut, MessageSquare } from "lucide-react";
import { GroupChat, User } from "../../../interface";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert";
import Button from "./ButtonLogin";


export default function GroupList({
    group, 
    userID, 
    key_index,
    expandedGroup,
    handleLeaveGroup,
    chatGroup,
    toggleGroup,
    users
}: { 
    group: GroupChat, 
    userID: string, 
    key_index: number,
    expandedGroup: string, 
    handleLeaveGroup: (group: GroupChat) => void 
    chatGroup: (group: GroupChat) => void
    toggleGroup: (groupName: string) => void
    users: User[]
    }) {
   
    return(
        <div key={key_index} className="bg-gray-200 rounded">
            <div className="flex justify-between items-center px-4 py-2">
                <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <span>{group.name} ({group.member.length})</span>
                </div>
                <div className="flex gap-2">
                {/* 👇 Leave Group button shows only if user is in group*/}
                {group.member.includes(userID) && (
                    <AlertDialog>
                            <AlertDialogTrigger><LogOut className="w-5 h-5 text-red-500 cursor-pointer" /></AlertDialogTrigger>
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
                                        <Button
                                        onClick={() => handleLeaveGroup(group)}
                                        >
                                            confirm
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                )} 
                <MessageSquare 
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => chatGroup(group)}
                    />
                    {
                    expandedGroup === group.name ?
                    <ChevronUp
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => toggleGroup(group.name)}
                    />
                    :
                    <ChevronDown
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => toggleGroup(group.name)}
                    />
                    }
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
    );
}