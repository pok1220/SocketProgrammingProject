import NextAuth from "next-auth";

declare module "next-auth"{
    interface Session{
        user:{
            _id:string,
            name:string,
            email:string,
            token:string,
            isOn:string,
            picture:string,
            id?:string
        }
    }
}