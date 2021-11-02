const Indie = require("../models/indie");
const User = require("../models/user");

const HttpError = require("../models/http-error");

exports.postIndie = async (req, res, next) => {
  const { number, name, imageUrl, description, sns } = req.body;

  const newIndie = new Indie({
    number,
    name,
    imageUrl,
    description,
    sns,
  });

  try {
    await newIndie.save();
  } catch (err) {
    const error = new HttpError("Error, Couldn't create new Indie", 500);
    return next(error);
  }

  res.status(201).json({ indie: newIndie });
};

exports.getIndieInfo = async (req, res, next) => {
  const indieName = req.params.indieName;

  let willBeEditedIndie;
  try {
    willBeEditedIndie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "Error, Couldn't bring the Indie Information",
      500
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
      "Error, Couldn't bring the Indie Information",
      500
    );
    return next(error);
  }

  const { name, imageUrl, description, sns } = req.body;
  willBeEditedIndie.name = name;
  willBeEditedIndie.imageUrl = imageUrl;
  willBeEditedIndie.description = description;
  willBeEditedIndie.sns = sns;

  try {
    await willBeEditedIndie.save();
  } catch (err) {
    const error = new HttpError(
      "Error, Couldn't save the Edited Indie Information",
      500
    );
    return next(error);
  }

  res.status(200).json({ indie: willBeEditedIndie });
};

exports.deleteIndie = async (req, res, next) => {
  const indieName = req.params.indieName;

  try {
    await Indie.deleteOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Error, Couldn't delete the indie", 500);
    return next(error);
  }

  res.status(200).json({ message: "delete completed!" });
};
