const express = require("express");
/*
const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();
 */
const Indie = require("../models/indie");
const indieController = require("../controllers/indies");
const checkAuth = require("../middleware/auth-mw");

const router = express.Router();

router.get("/", indieController.getRandomIndie);

router.get("/:indieName", indieController.getSearchedIndie);

router.get("/:indieName/support", indieController.getSupportMessage);

router.use(checkAuth);

router.put("/:indieName/like", indieController.putIndieLike);

router.post(
  "/:indieName/support",
  /*  [
    body("title").trim().not().isEmpty(),
    body("message").trim().isLength({ min: 5 }),
  ], */
  indieController.postSupportMessage
);

router.delete(
  "/:indieName/support/:supportMessageId",
  indieController.deleteSupportMessage
);

/*




router.post("/:indieName/support", indieController.createSupportMessage);
*/
module.exports = router;
