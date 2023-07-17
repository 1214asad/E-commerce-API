const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customApiError = {
    statuscode: err.statusCode || StatusCodes.BAD_REQUEST,
    msg: err.message || "Something went wrong Please try again.",
  };

  if (err.name === "ValidationError") {
    customApiError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customApiError.statuscode = 400;
  }
  if (err.code && err.code === 11000) {
    customApiError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customApiError.statuscode = 400;
  }
  if (err.name === "CastError") {
    customApiError.msg = `No item found with id : ${err.value}`;
    customApiError.statuscode = 404;
  }

  return res
    .status(customApiError.statuscode)
    .json({ msg: customApiError.msg });
};

module.exports = errorHandlerMiddleware;
