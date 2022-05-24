class ApiError extends Error {
  constructor(message, status = 500, isOperational = true, stack = '') {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
  
module.exports = ApiError;
