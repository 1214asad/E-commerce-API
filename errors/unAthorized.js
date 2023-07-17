const customApiError = require("./customAPI");
const { StatusCodes } = require("http-status-codes");

class unAuthorizedHandler extends customApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = unAuthorizedHandler;
