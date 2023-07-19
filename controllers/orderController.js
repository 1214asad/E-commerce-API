const { StatusCodes } = require("http-status-codes");
const Product = require("../Model/Product");
const { notFoundHandler, BadReqHandler } = require("../errors");
const Order = require("../Model/order");
const { checkPermissions } = require("../utils");

const fakeApi = async ({ amount, currency }) => {
  const client_secret = "asdf<>?}{_+)(*&^%$#tf72idft72";
  return { amount, client_secret };
};

const createOrders = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadReqHandler("select the item for carts");
  }
  if (!tax || !shippingFee) {
    throw new BadReqHandler("Provide tax and shipping fee first");
  }
  let subTotal = 0;
  let orderItems = [];
  for (const item of cartItems) {
    const dbProduct = await Product.find({ _id: item.product });
    if (!dbProduct) {
      throw new notFoundHandler(`product with id ${item.product} is not found`);
    }
    const { name, price, image, _id } = dbProduct[0];
    const singleProduct = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleProduct];
    subTotal += item.amount * price;
  }
  const total = subTotal + shippingFee + tax;
  const paymentIntent = await fakeApi({
    amount: total,
    currency: "Rs",
  });
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clentSecret: order.clientSecret });
};

// get all orders .....
const getallOrders = async (req, res) => {
  const allOrders = await Order.find({});
  res.status(StatusCodes.OK).json(allOrders);
};

const getSingleOrders = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new notFoundHandler("no order found");
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json(order);
};

const getCurrentUserOrders = async (req, res) => {
  const order = await Order.findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ order, count: order.length });
};

const updateOrders = async (req, res) => {
  const id = req.params.id;
  const { paymentId } = req.body;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new notFoundHandler("no order found");
  }
  checkPermissions(req.user, order.user);
  order.paymentId = paymentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json(order);
};

module.exports = {
  getSingleOrders,
  getallOrders,
  getCurrentUserOrders,
  createOrders,
  updateOrders,
};
