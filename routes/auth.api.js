const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const passport = require("passport");

/**
 * @route POST api/auth/login
 * @description Login
 * @access Public
 */

router.post("/login", authController.loginWithEmail);
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token", { session: false }),
  authController.loginWithFacebookOrGoogle
);
router.post(
  "/login/google",
  passport.authenticate("google-token", { session: false }),
  authController.loginWithFacebookOrGoogle
);

module.exports = router;
