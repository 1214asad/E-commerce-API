const express = require("express");
const {
  authenticateUser,
  adminVarification,
} = require("../middlewares/AuthentiateUser");
const {
  createProductControllers,
  getAllProductControllers,
  getSingleProductControllers,
  updateProductControllers,
  deleteProductControllers,
  uploadimageControllers,
} = require("../controllers/Product");

const { allProductReview } = require("../controllers/reviewController");
const router = express();

router
  .route("/")
  .post(authenticateUser, adminVarification("admin"), createProductControllers)
  .get(getAllProductControllers);

router
  .route("/uploadimage")
  .post(authenticateUser, adminVarification("admin"), uploadimageControllers);

router
  .route("/:id")
  .get(getSingleProductControllers)
  .patch(authenticateUser, adminVarification("admin"), updateProductControllers)
  .delete(
    authenticateUser,
    adminVarification("admin"),
    deleteProductControllers
  );

router.route("/:id/reviews").get(allProductReview);

module.exports = router;
