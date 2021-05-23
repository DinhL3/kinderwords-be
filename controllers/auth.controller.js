const User = require("../models/User");
const bcrypt = require("bcrypt");

const loginWithEmail = async (req, res, next) => {
  try {
    // Login process
    // 1. Get the email and password from body
    const { email, password } = req.body;

    const user = await User.findOne({ email }, "+password");
    // check if email and password matches
    if (!user)
      return res.status(400).json({
        success: false,
        error: "Wrong email or password",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        success: false,
        error: "Wrong email or password",
      });

    // generate token
    // every request from frontend must have token
    const token = await user.generateToken();

    res.status(200).json({
      status: "Logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

module.exports = {
  loginWithEmail,
};
