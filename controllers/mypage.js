const Indie = require("../models/indie");
const User = require("../models/user");
const Support = require("../models/support");
const Contact = require("../models/contact");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

exports.getMySupportMessage = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userData.userId);

  let mySupportMessage;
  try {
    mySupportMessage = await Support.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Support 메시지를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!mySupportMessage) {
    const error = new HttpError("Support 메시지를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let indie;

  const mySupportMessageJson = [];

  await Promise.all(
    mySupportMessage.map(async (el) => {
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
      mySupportMessageJson.push({
        title,
        body,
        nickname,
        creator,
        id,
        indieName,
      });
    })
  );

  res.status(200).json({
    message: "Support 메시지를 불러왔습니다.",
    mySupportMessageJson,
  });
};

exports.getMyContactMessage = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userData.userId);
  let contactMessages;
  try {
    contactMessages = await Contact.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Contact 메시지를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!contactMessages) {
    const error = new HttpError("Contact 메시지를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  const myContactMessageJson = [];
  const toFront = contactMessages.forEach((el) => {
    let title = el.title;
    let content = el.content;
    let nickname = el.nickname;

    let id = el._id.toString();
    let createdDate = el.createdDate.toISOString();
    let replyStatus = el.reply;
    myContactMessageJson.push({
      title,
      content,
      nickname,
      id,
      createdDate,
      replyStatus,
    });
  });

  res
    .status(200)
    .json({ message: "Contact 메시지를 불러왔습니다.", myContactMessageJson });
};
