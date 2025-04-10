import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupMenu(){
    return(
        <Card className="w-full shadow-xl mt-10">
            <CardHeader className="justify-between flex">
                <CardTitle className="flex">Group Chat</CardTitle>
                    <CardContent className="flex flex-col py-5 w-full">
              
                    </CardContent>
            </CardHeader>
        </Card>
    )
}