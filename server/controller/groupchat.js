const GroupChat = require('../models/GroupChat');
const User = require('../models/User')

// @desc Get all group chats
// @route GET /api/v1/groupchats
// @access Public
exports.getGroupChats = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|e)\b/g, match => `$${match}`);

    query = GroupChat.find(JSON.parse(queryStr)).populate('message.sendBy', 'name email picture');

    // Field selection
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await GroupChat.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const groupChats = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: groupChats.length,
      pagination,
      data: groupChats,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc Get single group chat
// @route GET /api/v1/groupchats/:id
// @access Public
exports.getGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.findById(req.params.id).populate('message.sendBy', 'name email picture');
    ;
    if (!groupChat) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: groupChat });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc Create new group chat
// @route POST /api/v1/groupchats
// @access Private
exports.postGroupChat = async (req, res, next) => {
  try {
    // console.log(req.body)
    const groupChat = await GroupChat.create(req.body);
    res.status(201).json({ success: true, data: groupChat });
  } catch {
    res.status(400).json({ success: false, text: 'Created failed' });
  }
};

// @desc Update group chat
// @route PUT /api/v1/groupchats/:id
// @access Private
exports.putGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!groupChat) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: groupChat });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc Delete group chat
// @route DELETE /api/v1/groupchats/:id
// @access Private
exports.deleteGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.findById(req.params.id);
    if (!groupChat) {
      return res.status(400).json({ success: false });
    }
    await GroupChat.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, data: {} });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc Join group chat
// @route PUT /api/v1/groupchats/join/:roomid
// @access Private
exports.joinGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.updateOne({
                    _id: req.params.roomid,               
                },{ $addToSet: {member: req.body.userid}});
    // const groupChat = await GroupChat.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const joinUser = await User.updateOne({
                    _id: req.body.userid,
                }, {$addToSet: {room: req.params.roomid}});
    if (!groupChat || !joinUser) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: groupChat });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc Messaging group chat
// @route PUT /api/v1/groupchats/message/:roomid
// @access Private
exports.messageGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.updateOne({
      _id: req.params.roomid,               
    },{ $addToSet: {message: req.body}});
    if (!groupChat) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: groupChat });
  } catch {
    res.status(400).json({ success: false });
  }
};

// @desc Leave group chat
// @route PUT /api/v1/groupchats/leave/:roomid
// @access Private
exports.leaveGroupChat = async (req, res, next) => {
  try {
    const groupChat = await GroupChat.updateOne(
      { _id: req.params.roomid},
      {
          $pull: {
              member: req.body.userId,
              message: {userId: req.body.userId}
          }
  })

  const user = await User.updateOne(
      {_id: req.body.userId},
      {$pull : {room: req.params.roomid}}
  )
    if (!groupChat || !user) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {groupChat: groupChat, user: user} });
  } catch {
    res.status(400).json({ success: false });
  }
};