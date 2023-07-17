const customApiError = require("./customAPI");
const { StatusCodes } = require("http-status-codes");

class notFoundErrorHandler extends customApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = notFoundErrorHandler;
