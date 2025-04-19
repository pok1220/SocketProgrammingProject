import axios from "axios"
import { GroupChat} from "../../interface"
export default async function getGroupChats(){
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/groupchat`
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to fetch GroupChat")
    }
    // console.log(response.data)
    return await response.data.data
}