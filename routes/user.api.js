const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { loginRequired } = require("../middlewares/authentication");

router.post("/", userController.createUser);
router.get("/", loginRequired, userController.getAllUsers);
router.get("/me", loginRequired, userController.getCurrentUser);
// router.put("/me", loginRequired, userController.updateProfile);

module.exports = router;
