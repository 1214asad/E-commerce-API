require("dotenv").config();
require("express-async-errors");
const express = require("express");
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUploader = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

// import mongoose from db
const connectdb = require("./db/connectdb");

//importing  Middlewares
const notFoundMiddleWare = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/ErrorMiddleware");
app.use(cors());

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 15,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.static("./public"));
app.use(express.json());
app.use(fileUploader());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));

// importing routes
const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reveiwRoutes = require("./routes/Review");
const ordersRoute = require("./routes/orders");

// routes
app.get("/api/v1/", (req, res) => {
  console.log(req.signedCookies);
  res.send("E-commerce website");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reveiw", reveiwRoutes);
app.use("/api/v1/orders", ordersRoute);

// Middlewares
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);

// enviroments variable declation

let port = process.env.PORT;
let uri = process.env.MONGO_URI;

// constructing the connection of mongo and port

const start = () => {
  try {
    connectdb(uri);
    app.listen(port, () => {
      console.log(`connect to the port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
