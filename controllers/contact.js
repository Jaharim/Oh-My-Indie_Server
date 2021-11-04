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
    const error = new HttpError(
      "Saving(Submitting) a Contact Message was failed.",
      500
    );
    return next(error);
  }

  res.status(201).json({ contactMessage });
};
