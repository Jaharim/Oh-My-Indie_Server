const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/keys");

const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;

  let nicknameCheck;
  try {
    nicknameCheck = await User.findOne({ nickname: nickname });
  } catch (err) {
    const error = new HttpError(
      "회원들의 닉네임을 조회하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (nicknameCheck) {
    const error = new HttpError("이미 사용중인 닉네임입니다.", 401);
    return next(error);
  }

  let emailCheck;
  try {
    emailCheck = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "회원들의 이메일을 조회하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  if (emailCheck) {
    const error = new HttpError("이미 가입된 이메일입니다.", 401);
    return next(error);
  }

  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "비밀번호를 Hashing 하는 데 실패했습니다.",
      500
    );
    return next(error);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("유효하지 않은 입력이 있습니다.", 422);
    return next(error);
  }

  const user = new User({
    email: email,
    password: hashedPw,
    nickname: nickname,
  });

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("회원가입에 실패했습니다.", 500);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      `${db.jwt_key}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("user token을 생성하는 데 실패했습니다.", 500);
    return next(error);
  }

  res.status(201).json({
    message: "회원가입이 완료되었습니다.",
    userId: user.id,
    token: token,
    email: user.email,
  });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("이메일을 찾을 수 없습니다.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("이메일을 찾을 수 없습니다.", 401);
    return next(error);
  }

  loadedUser = user;
  let passwordCheck = false;
  try {
    passwordCheck = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("올바른 비밀번호를 입력해주세요.", 500);
    return next(error);
  }

  if (!passwordCheck) {
    const error = new HttpError("올바른 비밀번호를 입력해주세요.", 401);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id,
      },
      `${db.jwt_key}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("user token을 생성하는 데 실패했습니다.", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ token: token, userId: loadedUser.id, email: loadedUser.email });
};
