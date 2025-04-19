import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "../../../interface";
import { useSession } from "next-auth/react";

export default function PrivateMenu({ privates }: { privates: User[] }) {
  const { data: session } = useSession();
  const userID = session?.user.id ?? "";

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="flex">
        <CardTitle className="text-center">Private</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col py-5 w-full">
        {privates.map((eachUser: User) => {
          if (eachUser._id === userID) return null; // Skip self
          return (
            <div key={eachUser._id} className="mb-2 flex items-center justify-between">
              <span>{eachUser.name}</span>
              <span className={eachUser.isOn ? "text-green-500" : "text-gray-400"}>
                Status: {eachUser.isOn ? "On" : "Off"}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
