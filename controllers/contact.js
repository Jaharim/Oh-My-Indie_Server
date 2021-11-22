const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Contact = require("../models/contact");

const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.submitContactMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Validation failed.", 422);
    return next(error);
  }
  const { title, content } = req.body;

  let user;
  try {
    user = await User.findOne({ userId: req.userData.userId });
  } catch (err) {
    const error = new HttpError("Finding User Data was failed.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("A User could not be found.", 404);
    return next(error);
  }

  const nickname = user.nickname;

  const contactMessage = new Contact({
    title,
    content,
    nickname,
    createdDate: new Date(new Date().getTime()),
    creator: req.userData.userId,
  });

  console.log(contactMessage);

  try {
    await contactMessage.save();
  } catch (err) {
    const error = new HttpError(
      "Saving(Submitting) a Contact Message was failed.",
      500
    );
    return next(error);
  }

  res.status(201).json({ contactMessage });
};
