const Indie = require("../models/indie");
const fileUpload = require("../middleware/file-upload");
const fs = require("fs");

const HttpError = require("../models/http-error");
const Contact = require("../models/contact");

exports.postIndie = async (req, res, next) => {
  console.log(req.file);
  const {
    numberString,
    name,
    company,
    song,
    birth,
    description,
    soundcloud,
    instagram,
    youtube,
  } = req.body;

  const number = Number(numberString);
  const newIndie = new Indie({
    number,
    name,
    image: req.file.path,
    company,
    song,
    birth,
    description,
    soundcloud,
    instagram,
    youtube,
  });

  try {
    await newIndie.save();
  } catch (err) {
    const error = new HttpError("Posting a new Indie was failed", 500);
    return next(error);
  }

  res.status(201).json({ message: "Post a new Indie complete!" });
};

exports.getIndieInfo = async (req, res, next) => {
  const indieName = req.params.indieName;

  let willBeEditedIndie;
  try {
    willBeEditedIndie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "Finding a Indie by this indieName was failed",
      500
    );
    return next(error);
  }

  if (!willBeEditedIndie) {
    const error = new HttpError(
      "A Indie with this indieName could not be found.",
      404
    );
    return next(error);
  }

  res.status(200).json({ indie: willBeEditedIndie });
};

exports.editIndie = async (req, res, next) => {
  const params = req.params.indieName;

  let willBeEditedIndie;
  try {
    willBeEditedIndie = await Indie.findOne({ name: params });
  } catch (err) {
    const error = new HttpError(
      "Finding a Indie by this indieName was failed",
      500
    );
    return next(error);
  }

  if (!willBeEditedIndie) {
    const error = new HttpError(
      "A Indie with this indieName could not be found.",
      404
    );
    return next(error);
  }

  const {
    numberString,
    name,
    company,
    song,
    birth,
    description,
    soundcloud,
    instagram,
    youtube,
    checkEditImg,
  } = req.body;

  const number = Number(numberString);

  let imagePath = willBeEditedIndie.image;
  if (checkEditImg === "true") {
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
    imagePath = req.file.path;
  }

  console.log(imagePath);

  willBeEditedIndie.number = number;
  willBeEditedIndie.name = name;
  willBeEditedIndie.image = imagePath;
  willBeEditedIndie.company = company;
  willBeEditedIndie.song = song;
  willBeEditedIndie.birth = birth;
  willBeEditedIndie.description = description;
  willBeEditedIndie.soundcloud = soundcloud;
  willBeEditedIndie.instagram = instagram;
  willBeEditedIndie.youtube = youtube;

  try {
    await willBeEditedIndie.save();
  } catch (err) {
    const error = new HttpError(
      "Saving the Edited Indie Information was failed",
      500
    );
    return next(error);
  }
  /* 
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });  */

  res.status(201).json({ indie: willBeEditedIndie });
};

exports.deleteIndie = async (req, res, next) => {
  const indieName = req.params.indieName;

  let indieForDeleteImg;
  try {
    indieForDeleteImg = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "Finding Indie For Deleting Image was failed",
      500
    );
    return next(error);
  }

  fs.unlink(indieForDeleteImg.image, (err) => {
    console.log(err);
  });

  try {
    await Indie.deleteOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "Deleting a indie with this indieName was failed",
      500
    );
    return next(error);
  }

  res.status(204).json({ message: "delete completed!" });
};

exports.getContactMessage = async (req, res, next) => {
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
