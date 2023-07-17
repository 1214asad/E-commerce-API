const User = require("../Model/user");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachedCookies,
  checkPermissions,
} = require("../utils");
const {
  notFoundHandler,
  BadReqHandler,
  unAuthorizedHandler,
} = require("../errors/");

// get All Routes
const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

// get single user route
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new notFoundHandler("user did not found. ");
  }
  console.log(req.user);
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

// show the current user
const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// update user details
const updateUserController = async (req, res) => {
  const { email, userName } = req.body;
  if (!email || !userName) {
    throw new BadReqHandler("provide email and password please");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.userName = userName;
  await user.save();
  const userToken = createTokenUser(user);
  attachedCookies({ res, user: userToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};
// update password
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadReqHandler("provide the both of the password.");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new unAuthorizedHandler("You are not authorized.");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password updated sucessfully." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserController,
  updateUserPassword,
};
