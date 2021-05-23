const express = require("express");
const router = express.Router();
const requestController = require("../controllers/request.controller");
const { loginRequired } = require("../middlewares/authentication");

router.post("/", loginRequired, requestController.createRequest);
router.get("/", loginRequired, requestController.getAllRequests);
router.get("/my_request", loginRequired, requestController.getMyRequest);
router.put("/my_request", loginRequired, requestController.editMyRequest);
router.delete("/my_request", loginRequired, requestController.deleteMyRequest);

// router.get("/single/:id", loginRequired, requestController.getSingleRequest);
module.exports = router;
