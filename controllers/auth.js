const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/keys");

const HttpError = require("../models/http-error");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Validation failed.", 422);
    return next(error);
  }

  const email = req.body.email;
  const nickname = req.body.nickname;
  const password = req.body.password;

  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Password hashing Error.", 500);
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
    const error = new HttpError("Error.", 500);
    return next(error);
  }

  res.status(201).json({ message: "User created!", userId: user._id });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    const error = new HttpError("Error.", 500);
    return next(error);
  }

  loadedUser = user;
  let passwordCheck;
  try {
    passwordCheck = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError("passwordCheck Error.", 500);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      `${db.jwt_key}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("passwordCheck Error.", 500);
    return next(error);
  }

  res.status(200).json({ token: token, userId: loadedUser._id.toString() });
};
