const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a text'],
    },
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please mark sender'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Then define the main GroupChat schema
const GroupChatSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please Provide Group Name'],
  },
  member: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['group', 'private'],
    default: 'private',
  },
  // room: {
  //   type: String,
  //   required: [true, 'Please Provide Room id'],
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: [MessageSchema],  
    default: [],
  },
});

module.exports = mongoose.model('GroupChat', GroupChatSchema);
