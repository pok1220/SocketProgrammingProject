const mongoose = require('mongoose')

const GroupChatSchema= new mongoose.Schema({
    member:{
        type: [mongoose.Schema.ObjectId],
        ref:'User',
        required: true
    },
    type:{
        type:String,
        enum:['group','private'],
        default:'private'
    },
    Room:{
        type:String,
        required:[true,"Please Provide Room id"]
    },
    createdAt:{
        type: Date,
        default: Date.now(),

    },
    message:{
        type: [mongoose.Schema.ObjectId],
        ref:'Message',
    }
})

module.exports=mongoose.model('GroupChat',GroupChatSchema)