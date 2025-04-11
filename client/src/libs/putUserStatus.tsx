import axios from "axios";

export default async function putUserStatus(status:boolean,token:string,userID:string) {
    console.log("token",token,status)
    const data={isOn:status}
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/changeStatus/${userID}`;
    console.log(apiUrl)
    try {
        const response = await axios.put(apiUrl,data, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status !== 200) {
            throw new Error(`Failed to update status: ${response.status}`);
        };

        return response.data; 
    } catch (error: any) {
        console.error("Error Update User Status", error.response || error.message || error);
        throw new Error("Error Update User Status");
    }
}
