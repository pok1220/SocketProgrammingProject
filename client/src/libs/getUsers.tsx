import axios from "axios"
import { GroupChat} from "../../interface"
export default async function getUsers(){
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/users`
    const response= await axios.get(apiUrl)
    if(!response){
        throw new Error("Falied to GetUser")
    }
    // console.log(response.data)
    return await response.data.data
}