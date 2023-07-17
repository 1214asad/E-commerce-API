const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFE_TIME,
  });
  return token;
};

const verifyJwt = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachedCookies = ({ res, user }) => {
  const token = createJwt({ payload: user });
  const expiresTime = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + expiresTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = { createJwt, verifyJwt, attachedCookies };
