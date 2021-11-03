const Indie = require("../models/indie");
const User = require("../models/user");
const Support = require("../models/support");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

exports.getSearchedIndie = async (req, res, next) => {
  const indieName = req.params.indieName;
  const { userId } = req.body;
  let likeClicked = false;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
    console.log(indie._id);
  } catch (err) {
    const error = new HttpError("getSearchedIndie failed.", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
    console.log(user);
  } catch (err) {
    const error = new HttpError("Find logged in User failed.", 500);
    return next(error);
  }

  let like = user.like.filter((p) => p.toString() === indie._id.toString());

  if (like.length > 0) {
    likeClicked = true;
  }

  res.json({ indie: indie, like: likeClicked });
};

exports.getRandomIndie = async (req, res, next) => {
  let indieCount;
  try {
    indieCount = await Indie.find().countDocuments();
  } catch (err) {
    const error = new HttpError("Indies Counting failed.", 500);
    return next(error);
  }

  const randomIndieNumber = Math.floor(Math.random() * indieCount) + 1;

  let randomIndie;
  try {
    randomIndie = await Indie.find({ number: randomIndieNumber });
  } catch (err) {
    const error = new HttpError("Bringing Random Indie failed.", 500);
    return next(error);
  }

  res.json({ randomIndie });
};

exports.getSupportMessage = async (req, res, next) => {
  const indieName = req.params.indieName;

  let supportMessage;
  try {
    supportMessage = await Support.find({
      indieName: indieName,
    });
  } catch (err) {
    const error = new HttpError("Getting Support Message failed", 500);
    return next(error);
  }

  res.json({ supportMessage });
};

exports.postSupportMessage = async (req, res, next) => {
  const { title, message, creator } = req.body;
  const indieName = req.params.indieName;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Could not find IndieId", 404);
    return next(error);
  }
  if (!indie) {
    const error = new HttpError("Could not find indie", 404);
    return next(error);
  }
  indieId = indie._id.toString();

  console.log(indie._id.toString());

  const supportMessage = new Support({
    title,
    message,
    creator,
    indieId,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Support Message failed,", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await supportMessage.save({ session: sess });
    user.supports.push(supportMessage);
    indie.supports.push(supportMessage);
    await user.save({ session: sess });
    await indie.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Posting new support message failed", 500);
    return next(error);
  }

  res.json({ supportMessage });
};

exports.deleteSupportMessage = async (req, res, next) => {
  const supportMessageId = req.params.supportMessageId;

  let userSupportMessage;
  try {
    userSupportMessage = await Support.findById(supportMessageId)
      .populate("creator")
      .populate("indieId");
    console.log(userSupportMessage);
  } catch (err) {
    const error = new HttpError("find Support Message failed,", 500);
    return next(error);
  }

  if (!userSupportMessage) {
    const error = new HttpError("Could not find Support Message", 404);
    return next(error);
  }

  //console.log(userSupportMessage);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await userSupportMessage.deleteOne({ session: sess });
    userSupportMessage.creator.supports.pull(userSupportMessage);
    userSupportMessage.indieId.supports.pull(userSupportMessage);
    await userSupportMessage.creator.save({ session: sess });
    await userSupportMessage.indieId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("deleting user's support part failed", 500);
    return next(error);
  }

  res.json({ userSupportMessage });
};

exports.putIndieLike = async (req, res, next) => {
  const indieName = req.params.indieName;
  const { userId } = req.body;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("getSearchedIndie failed.", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("find User by Id is failed", 404);
    return next(error);
  }

  let like;
  try {
    like = await user.like.filter((p) => p.toString() === indie._id.toString());
    console.log(like);
  } catch (err) {
    const error = new HttpError("Contact Message Submit failed.", 500);
    return next(error);
  }

  if (like.length > 0) {
    user.like.pull(indie._id);
    indie.like.pull(userId);
    try {
      await user.save();
      await indie.save();
    } catch (err) {
      const error = new HttpError("pull like failed", 500);
      return next(error);
    }
  } else {
    user.like.push(indie._id);
    indie.like.push(userId);
    try {
      await user.save();
      await indie.save();
    } catch (err) {
      const error = new HttpError("push like failed", 500);
      return next(error);
    }
  }

  res.json({ message: "put like complete!", like });
  //res.redirect(`indie/${indieName}/`);
};
