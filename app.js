const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const mongoKey = require("./config/keys");

const adminRoutes = require("./routes/admin");
const indieRoutes = require("./routes/indies");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const mypageRoutes = require("./routes/mypage");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.json());
app.use(express.json());

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", adminRoutes);
app.use("/indie", indieRoutes);
app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/mypage", mypageRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(mongoKey.keys)
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => console.log("서버가 응답하지 않습니다."));
