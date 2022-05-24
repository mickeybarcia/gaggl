const { UnAuthorizedError } = require('../errors');;
const { verifyToken } = require('../services/authTokenService');
const config = require('../config');

module.exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  const skipAuth = config.env == config.DEV_ENV || config.env == config.LOCAL_ENV;
  if (!token && !skipAuth) {
    throw UnAuthorizedError('No token provided')
  } else if (!skipAuth || token) {    
    try {
      const { id } = verifyToken(token);
      req.userId = id;
      next();
    } catch(err) {
      throw new UnAuthorizedError('Invalid token');
    }
  } else {
    req.userId = config.testUserId;
    next();
  }
};
