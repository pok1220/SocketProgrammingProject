import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupChat } from "../../../interface";

export default function GroupMenu({ groups }: { groups: GroupChat[] }) {
    return (
      <Card className="w-full shadow-xl">
        <CardHeader className="flex">
          <CardTitle className="text-center">Group Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col py-5 w-full">
          {groups.map((group) => (
            <div key={group.room} className="mb-2">
              {group.name}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  