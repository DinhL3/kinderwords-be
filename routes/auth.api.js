const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

/**
 * @route POST api/auth/login
 * @description Login
 * @access Public
 */

router.post("/login", authController.loginWithEmail);

module.exports = router;
