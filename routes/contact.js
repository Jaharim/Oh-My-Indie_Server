const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const contactController = require("../controllers/contact");
const checkAuth = require("../middleware/auth-mw");

const router = express.Router();

router.use(checkAuth);

router.post(
  "/",
  [
    body("title").trim().not().isEmpty(),
    body("content").trim().isLength({ min: 5 }),
  ],
  contactController.submitContactMessage
);

/* 
router.get("/", contactController.submitContactMessage); */

/* router.get("/status", isAuth, authController.getUserStatus);

router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
); */

module.exports = router;
