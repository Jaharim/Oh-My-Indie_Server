const express = require("express");

const Indie = require("../models/indie");
const User = require("../models/user");

const adminController = require("../controllers/admin");

const authMw = require("../middleware/auth-mw");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post("/addIndie", fileUpload.single("image"), adminController.postIndie);

router.get("/:indieName/editIndie", adminController.getIndieInfo);

router.patch(
  "/:indieName/editIndie",
  fileUpload.single("image"),
  adminController.editIndie
);

router.delete("/:indieName/deleteIndie", adminController.deleteIndie);

module.exports = router;
