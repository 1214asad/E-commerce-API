const express = require("express");
const router = express.Router();

const {
  getallOrders,
  createOrders,
  updateOrders,
  getSingleOrders,
  getCurrentUserOrders,
} = require("../controllers/orderController");

const {
  authenticateUser,
  adminVarification,
} = require("../middlewares/AuthentiateUser");

router
  .route("/")
  .post(authenticateUser, createOrders)
  .get(authenticateUser, adminVarification("admin"), getallOrders);

router.route("/showmyorders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrders)
  .patch(authenticateUser, updateOrders);

module.exports = router;
