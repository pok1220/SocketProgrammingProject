const express = require('express');
const dotenv = require('dotenv')
const connectDB= require('./config/db') //เรียกใช้ db
const app=express();
const user= require('./routes/auth')
const http = require('http'); //reccommended for socket sol
const {Server}= require('socket.io')
const server = http.createServer(app)
const cors= require('cors')

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

io.on("connection",(socket)=>{
    console.log(`User Connected: ${socket.id}`)
    socket.on('join_room',(data)=>{
        socket.join(data);
    })

    socket.on("create-something",(data)=>{
        socket.to(data.room).emit("receive_message",data)
        console.log("check",data);
    })
})


const PORT=process.env.PORT || 8081;
server.listen(PORT,()=>{
    console.log("Server Running at 8080")
})
