const User= require('../models/User');

//@desc Register user
//@route  POST /api/v1/auth/register
//@access Public

exports.register=async (req,res,next)=> {
    try {
        const {name,email,password,isOn}=req.body;
        //Create User
        const user= await User.create({
            name,
            email,
            password,
            isOn
        });
        // const token=user.getSignedJwtToken();
        // res.status(200).json({success:true,data:user,token:token})
        sendTokenResponse(user,200,res)
    }catch(err){
        res.status(400).json({success:false,error:err});
    }
}

//@desc Login user
//@route  POST /api/v1/auth/login
//@access Public
exports.login=async (req,res,next)=>{
    try{
        console.log("OK")
        const {email,password}=req.body;

        //Validate email and password
        if(!email || !password){
            return res.status(400).json({success:false,msg:"please provide an email and password"});
        }

        //Check for user
        const user=await User.findOne({email}).select('+password');

        //No user is in
        if(!user){
            return res.status(400).json({success:false,msg:"Invalid credential"});
        }

        const isMatch=await user.matchPassword(password)
        
        if(!isMatch){ //password wrong
            return res.status(401).json({success:false,msg:"Invalid credential"});
        }
        console.log("Loginsuccess",user)
        //Create token
        // const token=user.getSignedJwtToken();
        // res.status(200).json({success:true,token:token})
        sendTokenResponse(user,200,res)
    }catch(err){
        return res.status(401).json({success:false,msg:"Cannot convert email or password to string"});
    }
}

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout=async(req,res,next)=>{
    res.cookie('token','none',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        data: {}
    });
}


//@desc Get current Logged in user
//@route  POST /api/v1/auth/me
//@access Private
exports.getMe=async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data: user
    });
}



//Get token from model create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //Create token
    const token=user.getSignedJwtToken();

    const options={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true
    }

    res.status(statusCode).cookie('token',token,options).json({ //ตอนนี้เข้าใจว่าดึง cookie มาใช้เก็บ jwt เวลาจะใช้ jwt ก็ไปเอามาจาก cookie (สำหรับ frontend/test postman)
        success:true, 
        data:user,
        token
    })
    // res.status(statusCode)/*.cookie('token',token,options)*/.json({
    //     success:true,
    //     //add for frontend
    //     _id:user._id,
    //     name: user.name,
    //     email:user.email,
    //     //end for frontend
    //     token
    // })
        
}

