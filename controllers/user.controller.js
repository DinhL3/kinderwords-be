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

module.exports = {
  createUser,
};
