export interface FooEvent {
    message: string;
    timestamp: string;
    by:string;
}

export interface Message {
    message:string
    timestamp:string
    by:string
    room:string
}

export interface UserStatusResponse {
    userID:string,
    isOn:boolean
}