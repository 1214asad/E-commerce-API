const express = require("express");
const router = express();

const {
  loginController,
  registerController,
  logoutController,
} = require("../controllers/AuthController");

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/logout", logoutController);

module.exports = router;
