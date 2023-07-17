const Product = require("../Model/Product");
const Review = require("../Model/Review");
const { StatusCodes } = require("http-status-codes");
const {
  BadReqHandler,
  unAuthenticationHandler,
  notFoundHandler,
} = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isProductValid = await Product.findOne({ _id: productId });
  if (!isProductValid) {
    throw new notFoundHandler("the product is not present yet");
  }
  const alreadySubmiited = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmiited) {
    throw new unAuthenticationHandler("You Already send the review.");
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json(review);
};

const getAllReview = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ reviews, counts: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reveiwId } = req.params;
  const review = await Review.findOne({ _id: reveiwId }).populate({
    path: "product",
    select: "name company price",
  });
  if (!review) {
    throw new notFoundHandler("rivew of this id is not found..");
  }
  res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, tittle, comment } = req.body;
  if (!rating || !tittle || !comment) {
    throw new BadReqHandler("provide the complete info");
  }
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new notFoundHandler(`No review with id ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.tittle = tittle;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  // await Review.remove({ _id: reviewId });
  await Review.deleteOne({ _id: reviewId });
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

const allProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const productReviews = await Review.find({ product: productId });
  res
    .status(StatusCodes.OK)
    .json({ productReviews, counts: productReviews.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
  allProductReview,
};
