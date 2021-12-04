const express = require("express");
const { body } = require("express-validator");

const mypageController = require("../controllers/mypage");
const checkAuth = require("../middleware/auth-mw");

const router = express.Router();

router.use(checkAuth);

router.get("/support", mypageController.getMySupportMessage);

router.get("/contact", mypageController.getMyContactMessage);

module.exports = router;
