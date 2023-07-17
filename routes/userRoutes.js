const express = require("express");
const router = express();
const {
  authenticateUser,
  adminVarification,
} = require("../middlewares/AuthentiateUser");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserController,
  updateUserPassword,
} = require("../controllers/userControllers");

router
  .route("/")
  .get(authenticateUser, adminVarification("admin"), getAllUsers);
router.route("/showme").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUserController);
router.route("/updatePassword").patch(authenticateUser, updateUserPassword);

// id params in last
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
