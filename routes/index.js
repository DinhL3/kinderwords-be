const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "Hello World!" });
});

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// requestApi
const requestApi = require("./request.api");
router.use("/requests", requestApi);

// reviewApi
const replyApi = require("./reply.api");
router.use("/replies", replyApi);

module.exports = router;
