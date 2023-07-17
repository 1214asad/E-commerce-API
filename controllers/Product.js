const { StatusCodes } = require("http-status-codes");
const Product = require("../Model/Product");
const { notFoundHandler, BadReqHandler } = require("../errors");
const path = require("path");

const createProductControllers = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json(product);
};

const getAllProductControllers = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};
const getSingleProductControllers = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("review");
  if (!product) {
    throw new notFoundHandler("The product u r looking not found");
  }
  res.status(StatusCodes.OK).json(product);
};
const updateProductControllers = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json(product);
};
const deleteProductControllers = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  await product.removeReviews();
  await Product.deleteOne({ _id: productId });
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};
const uploadimageControllers = async (req, res) => {
  const productImage = req.files.image;
  if (!productImage) {
    throw new BadReqHandler("Uplaod the image");
  }
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadReqHandler("file is not image type");
  }
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadReqHandler("size of the image is larger.");
  }

  const filepath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(filepath);
  res.status(StatusCodes.OK).json({ image: `uploads/${productImage.name}` });
};

module.exports = {
  createProductControllers,
  getAllProductControllers,
  getSingleProductControllers,
  updateProductControllers,
  deleteProductControllers,
  uploadimageControllers,
};
