const ApiError = require('./ApiError');

class UnAuthorizedError extends ApiError {
    constructor(message) {
      super(message, 401);
    }
}
  
module.exports = UnAuthorizedError;
