const Request = require("../models/Request");

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
    const requests = await Request.find({
      user: { $ne: { _id: userId } },
    }).populate({
      path: "user",
      select: "-email -createdAt -updatedAt",
    });
    // .sort({ createdAt: -1 });

    const requestsFiltered = [
      ...new Map(requests.map((obj) => [`${obj.user._id}`, obj])).values(),
    ];

    res.status(200).json({
      status: "success",
      data: requestsFiltered,
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
