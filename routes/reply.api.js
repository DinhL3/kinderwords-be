const express = require("express");
const router = express.Router();
const replyController = require("../controllers/reply.controller");
const { loginRequired } = require("../middlewares/authentication");

router.post("/requests/:id", loginRequired, replyController.createReply);
router.get("/my_inbox", loginRequired, replyController.getMyInbox);

module.exports = router;
