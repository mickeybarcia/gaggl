const { EmailToken } = require('../models');

const createEmailToken = (userId) => EmailToken.create({ userId });

const getEmailToken = (token) => EmailToken.findOne({ token });

module.exports = {
    createEmailToken,
    getEmailToken
};
