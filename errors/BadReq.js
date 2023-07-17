const customApiError = require("./customAPI");
const { StatusCodes } = require("http-status-codes");

class BadReqErrorHandler extends customApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadReqErrorHandler;
