const { unAuthenticationHandler, unAuthorizedHandler } = require("../errors");
const { verifyJwt } = require("../utils/jwt");

const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new unAuthenticationHandler("You are not authenticated");
  }

  try {
    const { userName, userId, role } = verifyJwt({ token });
    req.user = { userName, userId, role };
    next();
  } catch (err) {
    console.log(err);
    throw new unAuthenticationHandler("You are not authenticated");
  }
};

const adminVarification = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new unAuthorizedHandler("you are not authorized");
    }
    next();
  };
};

module.exports = { authenticateUser, adminVarification };
