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
const authMw = require("../middleware/auth-mw");

const router = express.Router();

router.get("/", indieController.getRandomIndie);

router.get("/:indieName", indieController.getSearchedIndie);

router.get("/:indieName/support", indieController.getSupportMessage);

router.post("/admin/addIndie", indieController.postIndie);

router.get("/admin/:indieName/editIndie", indieController.getIndieInfo);

router.patch("/admin/:indieName/editIndie", indieController.editIndie);

router.delete("/admin/:indieName/deleteIndie", indieController.deleteIndie);

router.post(
  "/:indieName/support",
  /*  [
    body("title").trim().not().isEmpty(),
    body("message").trim().isLength({ min: 5 }),
  ], */
  indieController.postSupportMessage
);
/*



router.post("/:indieName/support", indieController.createSupportMessage);
*/
module.exports = router;