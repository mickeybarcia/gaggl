const crypto = require('crypto');

module.exports.random = (num=4) => crypto.randomBytes(num).toString('hex');
