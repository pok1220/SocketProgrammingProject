const express = require('express')
const { getGroupChat,getGroupChats,postGroupChat,putGroupChat,deleteGroupChat,joinGroupChat,messageGroupChat,leaveGroupChat } = require('../controller/groupchat');

const router=express.Router()

const {protect,authorize} = require('../middleware/auth')
//Include other resource
// const appointmentRouter= require('./appointments')

// router.use('/:hospitalId/appointments/',appointmentRouter); //ใช้ use เพราะ เราไม่ได้ใช้ route ตรงๆ hospital GET PUT แบบนั้น
 

router.route('/').get(getGroupChats).post(protect,postGroupChat) //protect ก่อนแล้ว authorize ตามต้องใส่ตามลำดับด้วย
router.route('/:id').get(getGroupChat).put(protect,putGroupChat).delete(protect,deleteGroupChat)
router.route('/join/:roomid').put(joinGroupChat);
router.route('/message/:roomid').put(messageGroupChat);
router.route('/leave/:roomid').put(leaveGroupChat);
module.exports=router; //ให้ server.js เรียกใช้

/**
 * @swagger
 * components:
 *   schemas:
 *     GroupChat:
 *       type: object
 *       required:
 *         - member
 *         - Room
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the group chat
 *           example: 662ecf9d87d88d001e45c3aa
 *         member:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs in the group chat
 *         type:
 *           type: string
 *           enum: [group, private]
 *           description: Type of the chat
 *         Room:
 *           type: string
 *           description: Unique room identifier
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Time of creation
 *         message:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             sendBy:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *       example:
 *         id: "662ecf9d87d88d001e45c3aa"
 *         member: ["661fbffddbb1f4d4b4e33f15", "661fbffeaa31d4d4b4e33f12"]
 *         type: "group"
 *         Room: "room123"
 *         createdAt: "2024-04-10T12:00:00Z"
 *         message:
 *           text: "Hello everyone!"
 *           sendBy: "661fbffddbb1f4d4b4e33f15"
 *           createdAt: "2024-04-10T12:01:00Z"
 */

/**
 *  @swagger
 *  tags:
 *      name: GroupChats
 *      description: The group chat managing API
 */

/**
 * @swagger
 * /groupchats:
 *   get:
 *     summary: Returns the list of all the group chats
 *     tags: [GroupChats]
 *     responses:
 *       200:
 *         description: The list of the group chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroupChat'
 */

/**
 * @swagger
 * /groupchats/{id}:
 *   get:
 *     summary: Get the group chat by ID
 *     tags: [GroupChats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: 
 *           type: string
 *         required: true
 *         description: The group chat ID
 *     responses:
 *       200:
 *         description: Group chat found
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupChat'
 *       404:
 *         description: The group chat was not found
 */

/**
 * @swagger
 * /groupchats:
 *   post:
 *     summary: Create a new group chat
 *     tags:
 *       - GroupChats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupChat'
 *     responses:
 *       201:
 *         description: Group chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupChat'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /groupchats/{id}:
 *   put:
 *     summary: Update a group chat by ID
 *     tags: [GroupChats]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The group chat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupChat'
 *     responses:
 *       200:
 *         description: Group chat updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroupChat'
 *       404:
 *         description: Group chat not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /groupchats/{id}:
 *   delete:
 *     summary: Delete a group chat by ID
 *     tags: 
 *       - GroupChats
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The group chat ID
 *     responses:
 *       200:
 *         description: Group chat deleted
 *       404:
 *         description: Group chat not found
 */
