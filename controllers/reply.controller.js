const Reply = require("../models/Reply");
const Request = require("../models/Request");
const Helper = require("../helpers/email.helper");

const createReply = async (req, res) => {
  try {
    const userId = req.userId;
    const requestId = req.params.id;
    const request = await Request.findOne({ _id: requestId }).populate({
      path: "user",
      select: "-createdAt -updatedAt",
    });

    const name = request.user.name;
    const email = request.user.email;

    const reply = new Reply({
      content: req.body.content,
      user: userId,
      request: requestId,
    });
    await reply.save();
    await Helper.emailInternalHelper.createTemplatesIfNotExists();
    const emailData = await Helper.emailHelper.renderEmailTemplate(
      "reply_notification_email",
      { name: name },
      email
    );
    if (!emailData.error) {
      Helper.emailHelper.send(emailData);
    } else {
      throw new Error("Create email fail");
    }

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

    const myRequests = await Request.find({ user: userId });
    const myRequestsIds = myRequests.map((request) => request._id);

    const replies = await Reply.find({ request: myRequestsIds })
      .populate({
        path: "request",
        select: "-createdAt -updatedAt -repliesCount -__v",
      })
      .populate({
        path: "user",
        select: "-email -createdAt -updatedAt",
      })
      .sort({ createdAt: -1 });

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
