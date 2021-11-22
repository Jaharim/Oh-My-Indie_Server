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
  } catch (err) {
    const error = new HttpError("Finding indie information was failed.", 500);
    return next(error);
  }

  if (!indie) {
    const error = new HttpError(
      "A Indie with this indieName could not be found.",
      404
    );
    return next(error);
  }
  /* 
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Find logged in User failed.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("A User with this id could not be found.", 404);
    return next(error);
  }

  let like = user.like.filter((p) => p.toString() === indie._id.toString());

  if (like.length > 0) {
    likeClicked = true;
  } */
  let like = [];

  res.status(200).json({
    message: "Get Searched Indie's information complete!",
    number: indie.number,
    name: indie.name,
    image: indie.image,
    company: indie.company,
    song: indie.song,
    birth: indie.birth,
    description: indie.description,
    youtube: indie.youtube,
    instagram: indie.instagram,
    soundcloud: indie.soundcloud,
    like: like.length,
  });
};

exports.getRandomIndie = async (req, res, next) => {
  let indieCount;
  try {
    indieCount = await Indie.find().countDocuments();
  } catch (err) {
    const error = new HttpError("Indies Counting failed.", 500);
    return next(error);
  }

  const randomIndieNumber = Math.floor(Math.random() * indieCount);

  let randomIndie;
  try {
    randomIndie = await Indie.find().skip(randomIndieNumber).limit(1);
  } catch (err) {
    const error = new HttpError("Bringing Random Indie failed.", 500);
    return next(error);
  }
  console.log(randomIndie);
  if (!randomIndie) {
    const error = new HttpError(
      "A Random Indie with this random indieNumber could not be found.",
      404
    );
    return next(error);
  }

  const likeNumber = randomIndie[0].like.length;

  res.status(200).json({
    message: "Get Randome Indie's information complete!",
    name: randomIndie[0].name,
    image: randomIndie[0].image,
    like: likeNumber,
  });
};

exports.getSupportMessage = async (req, res, next) => {
  const indieName = req.params.indieName;

  let supportMessage;
  try {
    supportMessage = await Support.find({
      indieName: indieName,
    });
  } catch (err) {
    const error = new HttpError(
      "Finding a Support Message by this indie name was failed",
      500
    );
    return next(error);
  }

  if (!supportMessage) {
    const error = new HttpError(
      "This indie's Support Messages could not be found.",
      404
    );
    return next(error);
  }
  const supportMessageJson = [];
  const toFront = supportMessage.forEach((el) => {
    let title = el.title;
    let body = el.message;
    let creator = el.nickname;
    supportMessageJson.push({ title, body, creator });
  });

  res
    .status(200)
    .json({ message: "Get Support Message complete!", supportMessageJson });
};

exports.postSupportMessage = async (req, res, next) => {
  const { title, message } = req.body;
  const indieName = req.params.indieName;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Finding a indie by indieName was failed", 500);
    return next(error);
  }

  if (!indie) {
    const error = new HttpError(
      "A Indie with this indieName could not be found.",
      404
    );
    return next(error);
  }

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Finding a user by creator Id was failed,",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "A User with this creator id could not be found.",
      404
    );
    return next(error);
  }

  indieId = indie._id.toString();

  const nickname = user.nickname;

  const supportMessage = new Support({
    title,
    message,
    nickname,
    creator: req.userData.userId,
    indieId,
  });

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
    const error = new HttpError(
      "Inserting SupportMessage's Id Related Collection was failed",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Post Support Message complete!",
    title: supportMessage.title,
    message: supportMessage.message,
    creator: user.nickname,
  });
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
    const error = new HttpError(
      "Finding Support Message by Support Message Id was failed,",
      500
    );
    return next(error);
  }

  if (!userSupportMessage) {
    const error = new HttpError("Could not find Support Message", 404);
    return next(error);
  }

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
    const error = new HttpError(
      "Deleting User and Indie collection's Support Message Id was failed",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ message: "Delete Support Message Complete!", userSupportMessage });
};

exports.putIndieLike = async (req, res, next) => {
  const indieName = req.params.indieName;
  const { userId } = req.body;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "Finding a Indie by indieName was failed.",
      500
    );
    return next(error);
  }

  if (!indie) {
    const error = new HttpError(
      "A Indie with this indieName could not be found.",
      404
    );
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Finding a User by Id was failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("A User with this id could not be found.", 404);
    return next(error);
  }

  let like;
  try {
    like = await user.like.filter((p) => p.toString() === indie._id.toString());
  } catch (err) {
    const error = new HttpError(
      "Filtering a User's Id in this Indie's like collection.",
      500
    );
    return next(error);
  }

  if (like.length > 0) {
    user.like.pull(indie._id);
    indie.like.pull(userId);
    try {
      await user.save();
      await indie.save();
    } catch (err) {
      const error = new HttpError(
        "Saving a User and Indie's like collection status was failed (Pulling a like)",
        500
      );
      return next(error);
    }
  } else {
    user.like.push(indie._id);
    indie.like.push(userId);
    try {
      await user.save();
      await indie.save();
    } catch (err) {
      const error = new HttpError(
        "Saving a User and Indie's like collection status was failed (Pushing a like)",
        500
      );
      return next(error);
    }
  }

  res.status(201).json({ message: "Put a like complete!", like });
};
