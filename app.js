require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUploader = require("express-fileupload");

const app = express();

// import mongoose from db
const connectdb = require("./db/connectdb");

//importing  Middlewares
const notFoundMiddleWare = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/ErrorMiddleware");
app.use(express.json());
app.use(morgan("tiny"));
app.use(fileUploader());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(cors());

// importing routes
const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reveiwRoutes = require("./routes/Review");

// routes
app.get("/api/v1/", (req, res) => {
  console.log(req.signedCookies);
  res.send("E-commerce website");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reveiw", reveiwRoutes);

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
