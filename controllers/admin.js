const Indie = require("../models/indie");
const Support = require("../models/support");
const fileUpload = require("../middleware/file-upload");
const fs = require("fs");
const mongoose = require("mongoose");

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
    const error = new HttpError("Indie 등록에 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({ message: "Indie 등록이 완료되었습니다." });
};

exports.getIndieInfo = async (req, res, next) => {
  const indieName = req.params.indieName;

  let willBeEditedIndie;
  try {
    willBeEditedIndie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError(
      "입력된 Indie의 정보를 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (!willBeEditedIndie) {
    const error = new HttpError(
      "입력된 Indie의 정보를 가져오는 데 실패습니다.",
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
      "입력된 Indie의 정보를 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (!willBeEditedIndie) {
    const error = new HttpError(
      "입력된 Indie의 정보를 가져오는 데 실패했습니다.",
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
    const error = new HttpError("수정된 내용을 저장하는 데 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({ indie: willBeEditedIndie });
};

exports.deleteIndie = async (req, res, next) => {
  const indieName = req.params.indieName;

  let indieForDeleteImg;
  try {
    indieForDeleteImg = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("입력된 Indie를 찾는 데 실패습니다.", 500);
    return next(error);
  }

  fs.unlink(indieForDeleteImg.image, (err) => {
    console.log(err);
  });

  try {
    await Indie.deleteOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("입력된 Indie를 찾는 데 실패습니다.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Indie 삭제가 완료되었습니다." });
};

exports.getContactMessage = async (req, res, next) => {
  let contactMessages;
  try {
    contactMessages = await Contact.find();
  } catch (err) {
    const error = new HttpError(
      "Contact 메시지들을 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }
  if (!contactMessages) {
    const error = new HttpError(
      "Contact 메시지들을 가져오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  const contactMessageJson = [];
  const toFront = contactMessages.forEach((el) => {
    if (!el.reply) {
      let title = el.title;
      let content = el.content;
      let nickname = el.nickname;
      let createdDate = el.createdDate.toISOString();
      let id = el._id;
      contactMessageJson.push({ title, content, nickname, createdDate, id });
    }
  });

  res
    .status(200)
    .json({ message: "Contact 메시지들을 가져왔습니다.", contactMessageJson });
};

exports.replyContactMessage = async (req, res, next) => {
  const { content, id } = req.body;
  const contactId = mongoose.Types.ObjectId(id);
  let contactMessage;
  try {
    contactMessage = await Contact.findOne({ _id: contactId });
  } catch (err) {
    const error = new HttpError("Contact 메시지를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!contactMessage) {
    const error = new HttpError(
      "Contact 메시지를 가져오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  contactMessage.reply = content;

  try {
    await contactMessage.save();
  } catch (err) {
    const error = new HttpError("답변을 저장하는 데 실패했습니다.", 500);
    return next(error);
  }

  res.status(200).json({ message: "답변을 완료했습니다." });
};

exports.getCompleteContactMessage = async (req, res, next) => {
  let contactMessages;
  try {
    contactMessages = await Contact.find();
  } catch (err) {
    const error = new HttpError(
      "Contact 메시지들을 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }
  if (!contactMessages) {
    const error = new HttpError(
      "Contact 메시지들을 가져오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  const contactMessageJson = [];
  const toFront = contactMessages.forEach((el) => {
    if (el.reply) {
      let title = el.title;
      let content = el.content;
      let nickname = el.nickname;
      let createdDate = el.createdDate.toISOString();
      let id = el._id;
      contactMessageJson.push({ title, content, nickname, createdDate, id });
    }
  });

  res.status(200).json({
    message: "답변이 있는 Contact 메시지들을 가져왔습니다.",
    contactMessageJson,
  });
};

exports.getReplyContent = async (req, res, next) => {
  const id = req.params.contactId;
  const contactId = mongoose.Types.ObjectId(id);
  let contactMessage;
  try {
    contactMessage = await Contact.findOne({ _id: contactId });
  } catch (err) {
    const error = new HttpError("Contact 메시지를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!contactMessage) {
    const error = new HttpError(
      "Contact 메시지를 가져오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  const content = contactMessage.reply;

  res
    .status(200)
    .json({ message: "Contact 메시지의 답변을 가져왔습니다.", content });
};

exports.deleteContactMessage = async (req, res, next) => {
  const { id } = req.body;
  const contactId = mongoose.Types.ObjectId(id);
  let contactMessages;
  try {
    contactMessages = await Contact.deleteOne({ _id: contactId });
  } catch (err) {
    const error = new HttpError(
      "Contact 메시지를 삭제하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Contact 메시지를 삭제했습니다." });
};

exports.getSupportMessage = async (req, res, next) => {
  let supportMessages;
  try {
    supportMessages = await Support.find();
  } catch (err) {
    const error = new HttpError(
      "Support 메시지들을 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }
  if (!supportMessages) {
    const error = new HttpError(
      "Support 메시지들을 가져오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  let indie;

  const supportMessageJson = [];

  await Promise.all(
    supportMessages.map(async (el) => {
      try {
        indie = await Indie.findOne({ _id: el.indieId });
      } catch (err) {
        const error = new HttpError("Indie를 찾는 데 실패했습니다.", 500);
        return next(error);
      }
      let title = el.title;
      let body = el.message;
      let nickname = el.nickname;
      let creator = el.creator.toString();
      let id = el._id.toString();
      let indieName = indie.name;
      supportMessageJson.push({
        title,
        body,
        nickname,
        creator,
        id,
        indieName,
      });
    })
  );

  res
    .status(200)
    .json({ message: "Support 메시지들을 가져왔습니다.", supportMessageJson });
};
