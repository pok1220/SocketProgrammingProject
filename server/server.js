const express = require('express');
const dotenv = require('dotenv')
const connectDB= require('./config/db') //เรียกใช้ db
const app=express();
const user= require('./routes/auth')
const http = require('http'); //reccommended for socket sol
const {Server}= require('socket.io')
const server = http.createServer(app)
const cors= require('cors')
const User = require('./models/User');
const GroupChat = require('./models/GroupChat')
const groupChat=require('./routes/groupchat')
const jwt = require('jsonwebtoken');
dotenv.config({path:'./config/config.env'})
connectDB(); //use db



app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  
};
// 
app.use(cors(corsOptions));  
app.use('/api/v1/auth',user)
app.use('/api/v1/groupchat',groupChat)

app.get("/", (req, res) => {
    res.send("Hello World!");
});


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // The specific origin of the client
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow credentials
    },
});

//try to get token
io.use((socket, next) => {
    const token = socket.handshake.auth.token; // Token sent by the client in handshake
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        console.log("decode",decoded)
        socket.userId = decoded.id; // Add userId to socket for later use
        next();
    });
});


io.on("connection",async (socket)=>{
    console.log(`User Connected: ${socket.userId}`)
    console.log("Socket Id",socket.id)
    socket.broadcast.emit("online")
    //join to everyroom this user is a member
    const userId = socket.userId;
    // const userRooms = await User.findById(userId);
    // userRooms.room.array.forEach(room => {
    //     socket.join(room._id.toString());
    // });

    //create new room from type of room, and room members
    socket.on('online',async (data)=>{
        try{
            socket.broadcast.emit("user_status", data);
        }catch(err){
            console.log(err);
        }
    })
    socket.on('create_room', async (data)=>{ //Implement along boom already
        try{
            console.log("data",data)
            socket.broadcast.emit("receive_group", data);
            // const newroom = await GroupChat.create({
            //     member: data.userIds,
            //     type: data.type,
            //     //roomid?
            // });
            
            // //add to user's room
            // await User.updateOne({
            //     _id: userId,
            // }, {$addToSet: {room: newroom._id}});

            // socket.join(newroom._id.toString());
        }catch(err){
            console.log(err);
        }
        
    })

    //join created group
    socket.on('join_room',async (data)=>{ //TODO
        try{
            // await GroupChat.updateOne({
            //     _id: data.roomId,               
            // },{ $addToSet: {member: data.userId}});

            // await User.updateOne({
            //     _id: data.userId,
            // }, {$addToSet: {room: data.roomId}});
            console.log("YOU NOW JOIN",data)
            socket.join(data.ID); //data is roomId(mongoObjid of room)
            socket.broadcast.emit("recieve_join_room",data)
        }catch(err){
            console.log(err);
        }
    })

    socket.on("create-something",async(data)=>{//TODO
        try{
            // await GroupChat.updateOne({
            //     _id: data.room,               
            // },{ $addToSet: {message: data}});
            //data is room id
            console.log("check",data.roomID);
            socket.to(data.roomID).emit("receive_message",data)
        }catch(err){
            console.log(err);
        }
        
    })

    //all chat room?
    socket.on("all_chat", (data)=>{//TODO
        socket.broadcast(data);
    })

    //leave chat
    socket.on('leave_room', async(data)=>{ //May be it's no need because disconnect socket is enough
        // await GroupChat.updateOne(
        //     { _id: data.room},
        //     {
        //         $pull: {
        //             member: data.userId,
        //             message: {userId: data.userId}
        //         }
        // })

        // await User.updateOne(
        //     {_id: data.userId},
        //     {$pull : {room: data.room}}
        // )
        socket.leave(data);
    })
})


const PORT=process.env.PORT || 8081;
server.listen(PORT,()=>{
    console.log("Server Running at 8080")
})
