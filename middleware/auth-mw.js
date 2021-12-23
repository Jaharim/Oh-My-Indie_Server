const jwt = require("jsonwebtoken");
const db = require("../config/keys");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("로그인 후 이용해주세요.");
    }
    const decodedToken = jwt.verify(token, `${db.jwt_key}`);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    const error = new HttpError("로그인 후 이용해주세요.", 401);
    return next(error);
  }
};
