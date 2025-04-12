const express= require('express')
const {register, login,getMe,logout,getUsers,putUserStatus}=require('../controller/auth')


const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register',register).post('/login',login);
router.get('/me',protect,getMe)
router.put('/changeStatus/:id',protect,putUserStatus)
router.get('/users',getUsers)
router.get('/logout',logout)

module.exports=router;