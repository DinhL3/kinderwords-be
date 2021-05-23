const User = require("../models/User");

// Instead of sending a string, this shoud receive a req body,
// create a new user Object, save it to db, and return the user object

const createUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json({
      success: true,
      data: user,
      message: `User ${user.name} created!`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err: err.message,
    });
  }
};

const getCurrentUser = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const user = await User.findById(userId);
  if (!user)
    return res.status(400).json({
      success: false,

      error: "User not found!",
    });
  return res.status(200).json({
    success: true,
    data: user,
    message: "Get current user successfully!",
  });
};

module.exports = { createUser, getAllUsers, getCurrentUser };
