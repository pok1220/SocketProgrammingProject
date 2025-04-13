export interface GroupChat{
    _id?:string,
    name:string,
    type:string,
    createdAt?:string,
    member:string[]
    message:Message[]
}

export interface Message{
    text:string,
    sendBy:User,
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

export interface CreateGroupResponse {
    data:GroupChat,
    success:boolean
}