const Reply = require("../models/Reply");
const Request = require("../models/Request");

const createReply = async (req, res) => {
  try {
    const userId = req.userId;
    const requestId = req.params.id;
    // How to get id of user that wrote request? Find the request and extract the user id

    const reply = new Reply({
      content: req.body.content,
      user: userId,
      request: requestId,
    });
    await reply.save();
    res.status(201).json({
      success: true,
      data: reply,
      message: `New reply created!`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const getMyInbox = async (req, res) => {
  try {
    const userId = req.userId;
    const request = await Request.findOne({
      user: { _id: userId },
    });
    const replies = await Reply.find({
      request: request._id,
    }).sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      data: replies,
      message: `Here is your inbox with all replies`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  createReply,
  getMyInbox,
};
