const jwt = require('jsonwebtoken');

const { random } = require('../utils/encypt');

const SECRET = random();
const REFRESH_SECRET = random();

module.exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, SECRET, { expiresIn: 3600 });
};

module.exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports.generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: 86400 });
};
