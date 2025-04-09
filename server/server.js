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

dotenv.config({path:'./config/config.env'})
connectDB(); //use db


app.use(express.json())
app.use(cors());
app.use('/api/v1/auth',user)
app.get("/", (req, res) => {
    res.send("Hello World!");
});


const io= new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods:["GET","POST"],
    },
});

//try to get token
io.use((socket, next) =>{
    // const token = socket.handshake.auth.token;
    // const payload = j
})
io.on("connection",async (socket)=>{
    console.log(`User Connected: ${socket.userId}`)//change to socket userId later

    //join to everyroom this user is a member
    const userId = socket.userId;
    const userRooms = await User.findById(userId);
    userRooms.room.array.forEach(room => {
        socket.join(room._id.toString());
    });

    //create new room from type of room, and room members
    socket.on('create_room', async (data)=>{
        try{
            const newroom = await GroupChat.create({
                member: data.userIds,
                type: data.type,
                //roomid?
            });
            
            //add to user's room
            await User.updateOne({
                _id: userId,
            }, {$addToSet: {room: newroom._id}});

            socket.join(newroom._id.toString());
        }catch(err){
            console.log(err);
        }
        
    })

    //join created group
    socket.on('join_room',async (data)=>{
        try{
            await GroupChat.updateOne({
                _id: data.roomId,               
            },{ $addToSet: {member: data.userId}});

            await User.updateOne({
                _id: data.userId,
            }, {$addToSet: {room: data.roomId}});
            socket.join(data.roomId);
        }catch(err){
            console.log(err);
        }
    })

    socket.on("create-something",async(data)=>{
        try{
            await GroupChat.updateOne({
                _id: data.room,               
            },{ $addToSet: {message: data}});
            socket.to(data.room).emit("receive_message",data)
            console.log("check",data);
        }catch(err){
            console.log(err);
        }
        
    })

    //all chat room?
    socket.on("all_chat", (data)=>{
        socket.broadcast(data);
    })

    //leave chat
    socket.on('leave_room', async(data)=>{
        await GroupChat.updateOne(
            { _id: data.room},
            {
                $pull: {
                    member: data.userId,
                    message: {userId: data.userId}
                }
        })

        await User.updateOne(
            {_id: data.userId},
            {$pull : {room: data.room}}
        )
    })
})


const PORT=process.env.PORT || 8081;
server.listen(PORT,()=>{
    console.log("Server Running at 8080")
})
