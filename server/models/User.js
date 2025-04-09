const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please add a name"]
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password:{
        type:String,
        required: [true,'Please add a password'],
        minlength:6,
        select:false
    },
    picture:{
        type:String,
    },
    room:{
        type: [mongoose.Schema.ObjectId]
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

});

//Encrypt Password using bcrypt
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

//Match user entered password password to hashed password in database
UserSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

module.exports= mongoose.model('User',UserSchema)