const { Match } = require('../models');

const getMatchesForUserId = async (userId) => {
  return await Match.find({
    $or: [
      { user1: userId },
      { user2: userId },
    ],
  })
};

const getMatchById = async (id) => Match.findById(id);

module.exports = {
    getMatchesForUserId,
    getMatchById
};
