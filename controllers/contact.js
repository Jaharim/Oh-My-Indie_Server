const { validationResult } = require("express-validator");

const Contact = require("../models/contact");

exports.submitContactMessage = (req, res, next) => {
  console.log("submitContactMessage");
  res.json({ lucky: "zzang" });
};
