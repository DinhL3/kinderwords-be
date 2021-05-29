const Request = require("../models/Request");
const Reply = require("../models/Reply");

const createRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const request = new Request({
      content: req.body.content,
      user: userId,
    });
    await request.save();
    res.status(201).json({
      success: true,
      data: request,
      message: `New request created!`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllRequests = async (req, res, next) => {
  try {
    const userId = req.userId;
    const repliesByMe = await Reply.find({ user: userId });
    const requestsRepliedByMeIds = repliesByMe.map((reply) => reply.request);

    let requests;
    if (requestsRepliedByMeIds.length > 0) {
      requests = await Request.find({
        _id: { $ne: requestsRepliedByMeIds },
        user: { $ne: userId },
      })
        .populate({
          path: "user",
          select: "-email -createdAt -updatedAt",
        })
        .sort({ createdAt: -1 });
    } else {
      console.log("user haven't replied to any requests!");
      requests = await Request.find({
        user: { $ne: userId },
      })
        .populate({
          path: "user",
          select: "-email -createdAt -updatedAt",
        })
        .sort({ createdAt: -1 });
    }

    // If a user create multiple requests, only show the latest
    function getUnique(array) {
      const arr = array;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].user._id === arr[j].user._id) {
            arr.splice(j, 1);
          }
        }
      }
      return arr;
    }

    const requestsLastestFromEachUserOnly = getUnique(requests);

    res.status(200).json({
      status: "success",
      data: requestsLastestFromEachUserOnly,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err: err.message,
    });
  }
};

const getMyRequest = async (req, res, next) => {
  try {
    const userId = req.userId;
    const requests = await Request.find({
      user: { _id: userId },
    }).populate({
      path: "user",
      select: "-email -createdAt -updatedAt",
    });
    res.status(200).json({
      status: "success",
      data: requests,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err: err.message,
    });
  }
};

const editMyRequest = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { content } = req.body;
    const request = await Request.findOneAndUpdate(
      {
        user: { _id: userId },
      },
      {
        content: content,
      },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error.message,
    });
  }
};

const deleteMyRequest = async (req, res, next) => {
  try {
    const userId = req.userId;
    const request = await Request.findOneAndDelete({ user: { _id: userId } });

    res.status(200).json({
      status: "Success, request deleted",
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error.message,
    });
  }
};

const getSingleRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate({
      path: "user",
      select: "-email -createdAt -updatedAt",
    });
    res.status(200).json({
      status: "Success",
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequest,
  getSingleRequest,
  editMyRequest,
  deleteMyRequest,
};
