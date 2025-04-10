import axios from 'axios';

export const register = async (data: { name: string; email:string; password: string;}) => {

    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`
        // console.log(apiUrl)
       
        const res = await axios.post(apiUrl, data);
        return res; 
    } catch (error) {
        console.error("Create User Error:", error);
        throw new Error("Failed to create user");
    }
};