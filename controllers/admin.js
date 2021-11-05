const Indie = require("../models/indie");

const HttpError = require("../models/http-error");

exports.postIndie = async (req, res, next) => {
  const { numberString, name, imageUrl, description, sns } = req.body;

  const number = Number(numberString);
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
    const error = new HttpError("Posting a new Indie was failed", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ message: "Post a new Indie complete!", indie: newIndie });
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

  const { name, imageUrl, description, sns } = req.body;
  willBeEditedIndie.name = name;
  willBeEditedIndie.imageUrl = imageUrl;
  willBeEditedIndie.description = description;
  willBeEditedIndie.sns = sns;

  try {
    await willBeEditedIndie.save();
  } catch (err) {
    const error = new HttpError(
      "Saving the Edited Indie Information was failed",
      500
    );
    return next(error);
  }

  res.status(201).json({ indie: willBeEditedIndie });
};

exports.deleteIndie = async (req, res, next) => {
  const indieName = req.params.indieName;

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
