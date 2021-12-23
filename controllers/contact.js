const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Contact = require("../models/contact");

const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.submitContactMessage = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("유효하지 않은 입력이 있습니다.", 422);
    return next(error);
  }
  const { title, content } = req.body;

  let userId = mongoose.Types.ObjectId(req.userData.userId);
  let user;
  try {
    user = await User.findById({ _id: userId });
  } catch (err) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("회원정보를 찾는 데 실패했습니다.", 404);
    return next(error);
  }

  const nickname = user.nickname;

  const contactMessage = new Contact({
    title,
    content,
    nickname,
    createdDate: new Date(new Date().getTime()),
    creator: req.userData.userId,
  });

  console.log(contactMessage);

  try {
    await contactMessage.save();
  } catch (err) {
    const error = new HttpError(
      "Contact 메시지를 제출하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  res.status(201).json({ contactMessage });
};
