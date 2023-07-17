const customApiError = require("./customAPI");
const { StatusCodes } = require("http-status-codes");

class unAuthenticationHandler extends customApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = unAuthenticationHandler;
