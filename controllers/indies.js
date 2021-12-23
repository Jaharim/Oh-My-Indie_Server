const Indie = require("../models/indie");
const User = require("../models/user");
const Support = require("../models/support");

const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

exports.getSearchedIndie = async (req, res, next) => {
  const indieName = req.params.indieName;
  const userId = mongoose.Types.ObjectId(req.userData.userId);
  let likeClicked = false;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("입력된 Indie를 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (!indie) {
    const error = new HttpError("입력된 Indie를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ _id: userId });
  } catch (err) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다. ", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let like = user.like.filter((p) => p.toString() === indie._id.toString());

  if (like.length > 0) {
    likeClicked = true;
  }

  res.status(200).json({
    message: "입력된 Indie의 정보를 가져왔습니다.",
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
    like: indie.like.length,
    likeClicked,
  });
};

exports.getRandomIndie = async (req, res, next) => {
  let indieCount;
  try {
    indieCount = await Indie.find().countDocuments();
  } catch (err) {
    const error = new HttpError("Indie counting을 하는 데 실패했습니다.", 500);
    return next(error);
  }

  const randomIndieNumber = Math.floor(Math.random() * indieCount);

  let randomIndie;
  try {
    randomIndie = await Indie.find().skip(randomIndieNumber).limit(1);
  } catch (err) {
    const error = new HttpError(
      "무작위로 Indie 정보를 불러오는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (!randomIndie) {
    const error = new HttpError(
      "무작위로 Indie 정보를 불러오는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  const likeNumber = randomIndie[0].like.length;

  res.status(200).json({
    message: "무작위로 Indie 정보를 불러왔습니다.",
    name: randomIndie[0].name,
    image: randomIndie[0].image,
    like: likeNumber,
  });
};

exports.getSupportMessage = async (req, res, next) => {
  const indieName = req.params.indieName;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!indie) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 404);
    return next(error);
  }
  const indieId = indie._id;

  let supportMessage;
  try {
    supportMessage = await Support.find({
      indieId: indie._id,
    });
  } catch (err) {
    const error = new HttpError(
      "해당 Indie의 Support 메시지들을 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (!supportMessage) {
    const error = new HttpError(
      "해당 Indie의 Support 메시지들을 찾는 데 실패했습니다.",
      404
    );
    return next(error);
  }
  const supportMessageJson = [];
  const toFront = supportMessage.forEach((el) => {
    let title = el.title;
    let body = el.message;
    let nickname = el.nickname;
    let creator = el.creator.toString();
    let id = el._id.toString();
    supportMessageJson.push({ title, body, nickname, creator, id });
  });

  res
    .status(200)
    .json({ message: "Support 메시지들을 불러왔습니다.", supportMessageJson });
};

exports.postSupportMessage = async (req, res, next) => {
  const { title, message } = req.body;
  const indieName = req.params.indieName;

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (!indie) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  indieId = indie._id;
  console.log(indieId);
  const userId = mongoose.Types.ObjectId(req.userData.userId);
  console.log(userId);
  const nickname = user.nickname;

  const supportMessage = new Support({
    title,
    message,
    nickname,
    creator: userId,
    createdDate: new Date(new Date().getTime()),
    indieId,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await supportMessage.save({ session: sess });
    user.supports.push(supportMessage._id);
    indie.supports.push(supportMessage._id);
    await user.save({ session: sess });
    await indie.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Support 메시지의 Id를 User, Indie collection에 추가하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "Support 메시지를 남겼습니다.",
    title: supportMessage.title,
    message: supportMessage.message,
    creator: user.nickname,
  });
};

exports.editSupportMessage = async (req, res, next) => {
  const { title, body, id } = req.body;

  let willBeEditedSupportMsg;
  try {
    willBeEditedSupportMsg = await Support.findOne({
      _id: mongoose.Types.ObjectId(id),
    });
  } catch (err) {
    const error = new HttpError(
      "수정될 Support 메시지를 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  let admin;
  try {
    admin = await User.findOne({ nickname: "admin" });
  } catch (err) {
    const error = new HttpError("admin을 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (
    willBeEditedSupportMsg.creator._id.toString() !== req.userData.userId &&
    admin._id.toString() !== req.userData.userId
  ) {
    const error = new HttpError(
      "해당 Support 메시지를 수정할 권한이 없습니다.",
      404
    );
    return next(error);
  }

  if (!willBeEditedSupportMsg) {
    const error = new HttpError(
      "수정될 Support 메시지를 찾는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  willBeEditedSupportMsg.title = title;
  willBeEditedSupportMsg.message = body;

  try {
    await willBeEditedSupportMsg.save();
  } catch (err) {
    const error = new HttpError("수정된 내용을 저장하는 데 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({ message: "Support 메시지를 수정했습니다." });
};

exports.deleteSupportMessage = async (req, res, next) => {
  const { id } = req.body;

  let supportMessage;
  try {
    supportMessage = await Support.findById(id)
      .populate("creator")
      .populate("indieId");
  } catch (err) {
    const error = new HttpError(
      "삭제될 Support 메시지를 찾는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  let admin;
  try {
    admin = await User.findOne({ nickname: "admin" });
  } catch (err) {
    const error = new HttpError("admin을 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (
    supportMessage.creator._id.toString() !== req.userData.userId &&
    admin._id.toString() !== req.userData.userId
  ) {
    const error = new HttpError(
      "해당 Support 메시지를 삭제할 권한이 없습니다.",
      404
    );
    return next(error);
  }

  if (!supportMessage) {
    const error = new HttpError(
      "삭제될 Support 메시지를 찾는 데 실패했습니다.",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await supportMessage.deleteOne({ session: sess });
    supportMessage.creator.supports.pull(supportMessage);
    supportMessage.indieId.supports.pull(supportMessage);
    await supportMessage.creator.save({ session: sess });
    await supportMessage.indieId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Support 메시지의 Id를 User, Indie collection에서 삭제하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ message: "Support 메시지를 삭제했습니다.", supportMessage });
};

exports.putIndieLike = async (req, res, next) => {
  const indieName = req.params.indieName;
  const userId = mongoose.Types.ObjectId(req.userData.userId);

  let indie;
  try {
    indie = await Indie.findOne({ name: indieName });
  } catch (err) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (!indie) {
    const error = new HttpError("Indie를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  let like;
  try {
    like = await user.like.filter((p) => p.toString() === indie._id.toString());
  } catch (err) {
    const error = new HttpError(
      "user의 like collection에서 회원정보를 찾는 데 실패했습니다.",
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
        "user와 indie의 like collection에서 서로의 id를 제거한 뒤 저장하는 데 실패했습니다.",
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
        "user와 indie의 like collection에서 서로의 id를 추가한 뒤 저장하는 데 실패했습니다.",
        500
      );
      return next(error);
    }
  }

  res.status(201).json({ message: "like 처리를 완료했습니다." });
};
