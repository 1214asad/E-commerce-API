const User = require("../Model/user");
const { StatusCodes } = require("http-status-codes");
const { BadReqHandler, unAuthenticationHandler } = require("../errors");
const { attachedCookies, createTokenUser } = require("../utils");

// register

const registerController = async (req, res) => {
  const { userName, email, password } = req.body;
  const emailAlreadypresent = await User.findOne({ email });
  if (emailAlreadypresent) {
    throw new BadReqHandler("email already exist");
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ userName, email, password, role });
  const tokenUser = createTokenUser(user);
  // generating cookie
  attachedCookies({ res, user: tokenUser });
  res.status(StatusCodes.ACCEPTED).json({
    user: tokenUser,
  });
};

// login...

const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadReqHandler("Provide email or password");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new unAuthenticationHandler(
      "user not found Please register first or login with correct email."
    );
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new unAuthenticationHandler("Wrong Password!");
  }
  const tokenUser = createTokenUser(user);
  attachedCookies({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// logout ....
const logoutController = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "logout successful" });
};

module.exports = { loginController, registerController, logoutController };
