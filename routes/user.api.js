const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/**
 * @route POST api/users
 * @description Register new user
 * @access Public
 */

router.post("/", userController.createUser);

/**
 * @route PUT api/users/
 * @description Update user profile
 * @access Login required
 */

/**
 * @route GET api/users/me
 * @description Get current user info
 * @access Login required
 */

/**
 * @route GET api/users?page=1&limit=10
 * @description Get users with pagination
 * @access Login required
 * not needed as all users are anonymous
 */

module.exports = router;
