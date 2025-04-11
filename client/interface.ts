export interface GroupChat{
    _id?:string,
    name:string,
    room:string,
    type:string,
    createdAt?:string,
    member:string[]
    message:Message[]
}

export interface Message{
    text:string,
    sendBy:string,
    createdAt:string,
}

export interface User{
    name:string,
    isOn:boolean,
    _id:string,
}

export interface UserStatusResponse {
    userID:string,
    isOn:boolean
}