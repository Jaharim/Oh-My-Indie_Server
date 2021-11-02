const { validationResult } = require("express-validator");

const Contact = require("../models/contact");

const HttpError = require("../models/http-error");

exports.submitContactMessage = async (req, res, next) => {
  const { title, content, user } = req.body;

  const contactMessage = new Contact({
    title,
    content,
    user,
  });

  try {
    await contactMessage.save();
  } catch (err) {
    const error = new HttpError("Contact Message Submit failed.", 500);
    return next(error);
  }

  res.json({ contactMessage });
};
