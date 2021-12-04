const Indie = require("../models/indie");
const User = require("../models/user");
const Support = require("../models/support");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

exports.getMySupportMessage = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userData.userId);
  console.log(userId);
  let mySupportMessage;
  try {
    mySupportMessage = await Support.find({ creator: userId });
    console.log(mySupportMessage);
  } catch (err) {
    const error = new HttpError("Finding a my support message was failed", 500);
    return next(error);
  }
  if (!mySupportMessage) {
    const error = new HttpError("This indie could not be found.", 404);
    return next(error);
  }

  const mySupportMessageJson = [];
  const toFront = mySupportMessage.forEach((el) => {
    let title = el.title;
    let body = el.message;
    let nickname = el.nickname;
    let creator = el.creator.toString();
    let id = el._id.toString();
    mySupportMessageJson.push({ title, body, nickname, creator, id });
  });

  console.log(mySupportMessageJson);

  res
    .status(200)
    .json({ message: "Get Support Message complete!", mySupportMessageJson });
};

exports.getMyContactMessage = async (req, res, next) => {
  let contactMessages;
  try {
    contactMessages = await Contact.find();
  } catch (err) {
    const error = new HttpError("Finding a Contact message was failed", 500);
    return next(error);
  }
  if (!contactMessages) {
    const error = new HttpError("This indie could not be found.", 404);
    return next(error);
  }

  const contactMessageJson = [];
  const toFront = contactMessages.forEach((el) => {
    let title = el.title;
    let content = el.content;
    let nickname = el.nickname;
    let createdDate = el.createdDate.toISOString();
    contactMessageJson.push({ title, content, nickname, createdDate });
  });

  console.log(contactMessageJson);

  res
    .status(200)
    .json({ message: "Get Support Message complete!", contactMessageJson });
};
