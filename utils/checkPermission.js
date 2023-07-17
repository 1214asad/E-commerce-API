const { unAuthorizedHandler } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new unAuthorizedHandler("You are not authorized to get this..");
};

module.exports = checkPermissions;
