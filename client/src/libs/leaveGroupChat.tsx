import axios from "axios";

export default async function leaveGroupChat(groupID: string, userID: string, token: string) {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groupChat/leave/${groupID}`;
    console.log(apiUrl)
    const sentData = {
        userId: userID
    }
    try {
        const response = await axios.put(apiUrl, sentData, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        // Check if the response is successful
        if (response.status !== 200) {
            throw new Error(`Failed to join GroupChat: ${response.status}`);
        }

        return response.data; // Return only the response data, not the whole response object
    } catch (error: any) {
        console.log(error);
        console.error("Error leave GroupChat", error.response || error.message || error);
        throw new Error("Failed to leave GroupChat");
    }
}
