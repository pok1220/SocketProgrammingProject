const express= require('express')
const {register, login,getMe,logout}=require('../controller/auth')


const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register',register).post('/login',login);
router.get('/me',protect,getMe)
router.get('/logout',logout)

module.exports=router;