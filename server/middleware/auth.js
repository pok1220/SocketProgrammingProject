const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Protect routes
exports.protect=async (req,res,next)=>{
    let token;

    //Make sure ว่า request ฝัง token ไว้ที่ header ไหม
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }

    //Make sure ว่ามี token อยู่
    if(!token || token=="null"){ // token null จากการ logout
        return res.status(401).json({success:false,message:"Not authorize to access this route"})
    }

    try{
        //Verify token 
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        // console.log(decoded) #{ id: '679eee28227e29e1082b58d5', iat: 1739083779, exp: 1741675779 } ข้อมูลใน token
        req.user=await User.findById(decoded.id); //ดึง user คนนั้นออกมา เก็บใน req.user
        next();
    }catch(err){
        console.log(err.stack)
        return res.status(401).json({success:false,message:"Not authorize to access this route"})
    }
}

exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){ //จาก req.user
            return res.status(403).json({success:false,message:`User role ${req.user.role} is not authorize to access this role`})
        }
        next()
    }
}