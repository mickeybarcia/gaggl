const catchAsync = require('../utils/catchAsync');
const { matchService, userService } = require('../services')

const getMatches = catchAsync(async (req, res) => {
    const userId = req.userId;
    const matches = await matchService.getMatchesForUserId(userId);
    const matchResults = matches.map(({ user1, user2, _id: id }) => {
        return {
            id,
            userId: user1 === userId ? user2 : user1,
            date: id.getTimestamp()
        }
    });
    const users = await userService.getUsersByIds(matchResults.map(_ => _.userId));
    const results = matchResults.map(matchResult => {
        const user = users
            .find(_ => _._id.toString() === matchResult.userId)
            .toJSON();
        return { user, ...matchResult };
    });
    res.send({ results });
});

const getMatch = catchAsync(async (req, res) => {
    const id = req.params.matchId;
    const userId = req.userId;
    const { user1, user2, _id } = await matchService.getMatchById(id);
    const matchResult = {
        id,
        date: _id.getTimestamp(),
        userId: user1 === userId ? user2 : user1
    };
    const user = await userService.getUserById(matchResult.userId);
    res.send({ user, ...matchResult });
});

module.exports = {
    getMatches,
    getMatch
};
