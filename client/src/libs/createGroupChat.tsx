import axios from "axios";
import { GroupChat } from "../../interface";

export default async function createGroupChat(data: GroupChat, token: string) {
  console.log(data)
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groupChat`;
    console.log(apiUrl)
    try {
        const response = await axios.post(apiUrl, data, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // Check if the response is successful
        if (response.status !== 201) {
            throw new Error(`Failed to create GroupChat: ${response.status}`);
        }

        // console.log("GroupChat created successfully", response.data);

        return response.data; // Return only the response data, not the whole response object
    } catch (error: any) {
        console.error("Error creating GroupChat", error.response || error.message || error);
        throw new Error("Failed to create GroupChat");
    }
}
