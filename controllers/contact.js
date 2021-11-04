const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Contact = require("../models/contact");

const HttpError = require("../models/http-error");

exports.submitContactMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Validation failed.", 422);
    return next(error);
  }
  const { title, content } = req.body;

  const user = mongoose.Types.ObjectId("61827b5439d7cd188c3f8dd2");
  //Front 에서 userId 가 넘어오는 것으로 변경해야함.

  const contactMessage = new Contact({
    title,
    content,
    user,
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
