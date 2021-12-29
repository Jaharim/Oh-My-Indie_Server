const express = require("express");

const indieController = require("../controllers/indies");
const checkAuth = require("../middleware/auth-mw");

const router = express.Router();

router.get("/", indieController.getRandomIndie);

router.use(checkAuth);

router.get("/:indieName", indieController.getSearchedIndie);

router.get("/:indieName/support", indieController.getSupportMessage);

router.get("/:indieName/like", indieController.putIndieLike);

router.post("/:indieName/support", indieController.postSupportMessage);

router.patch("/:indieName/support", indieController.editSupportMessage);

router.delete("/:indieName/support", indieController.deleteSupportMessage);

module.exports = router;
