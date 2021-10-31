const Indie = require("../models/indie");
const User = require("../models/user");

const DUMMY_INDIE = [
  {
    id: "p1",
    number: 1,
    name: "최정윤",
    description: {
      company: "매직스트로베리 사운드",
      song: "사라져",
      birth: "1994.05.23.",
      content: "가나다라마바사<br />아자차카타파하",
    },
    image: "image",
    sns: {
      youtube: "https://www.youtube.com/watch?v=JjPOEYwcd8Q",
      instagram: "https://www.instagram.com/moodyoon_/",
      soundcloud: "",
    },
    like: "none",
    bookmark: "none",
  },
  {
    id: "p1",
    number: 2,
    name: "최정윤2",
    description: {
      company: "매직스트로베리 사운드",
      song: "사라져",
      birth: "1994.05.23.",
      content: "가나다라마바사<br />아자차카타파하",
    },
    image: "image",
    sns: {
      youtube: "https://www.youtube.com/watch?v=JjPOEYwcd8Q",
      instagram: "https://www.instagram.com/moodyoon_/",
      soundcloud: "",
    },
    like: "none",
    bookmark: "none",
  },
];

const DUMMY_SUPPORT_MESSAGE = [
  {
    title: "행복하세요",
    message: "가나다라마바사",
    name: "유재석",
    indie: "최정윤",
  },
  {
    title: "건강하세요",
    message: "아자차카타파하",
    name: "하하",
    indie: "최정윤",
  },
];

exports.getSearchedIndie = (req, res, next) => {
  console.log("getSearchedIndie");
  const indieName = req.params.indieName;
  const indie = DUMMY_INDIE.find((p) => {
    return p.name === indieName;
  });
  res.json({ indie });
};

exports.getRandomIndie = (req, res, next) => {
  console.log("good");
  const randomIndieNumber = Math.floor(Math.random() * DUMMY_INDIE.length) + 1;
  const randomIndie = DUMMY_INDIE.find((p) => {
    return p.number === randomIndieNumber;
  });
  console.log(randomIndieNumber);
  res.json({ randomIndie });
};

exports.getSupportMessage = (req, res, next) => {
  console.log("support-message");
  const indieName = req.params.indieName;
  const supportMessage = DUMMY_SUPPORT_MESSAGE.filter((p) => {
    return p.indie === indieName;
  });
  res.json({ supportMessage });
};

exports.postSupportMessage = (req, res, next) => {
  console.log("support-message/post");
};
