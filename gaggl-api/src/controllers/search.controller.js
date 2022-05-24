const catchAsync = require('../utils/catchAsync');
const { userService, elasticService, redisService } = require('../services');

const searchMatches = catchAsync(async (req, res) => {
    const { location, tags, distance } = req.body;
    const userId = req.userId;

    const locationResults = await elasticService.searchGeoIndex({ location, distance })
    let previouslyCheckedUserIds = [];
    try {
        previouslyCheckedUserIds = await redisService.getCheckedUserIds(userId);
    } catch (error) {
        console.log('unable to get getCheckedUserIds from cache');
    }
    const excludeIds = previouslyCheckedUserIds.concat([ userId ]);
    const userIds = locationResults
        .map(({ _id }) => _id)
        .filter(_ => !excludeIds.includes(_));

    // TODO: paginate
    const searchResults = await userService.getUsersByIdsAndTagMatches({ userIds, tags });  
    const users = await userService.getUsersByIds(searchResults.map(_ => _._id));

    const results = searchResults.map(({ matchCount, _id: userId }) => {
        const { id, name, age, tags, profile } = users.find(_ => _.id == userId) || {};
        const user = { id, name, age, tags, profile };
        return { user, matchCount };
    });
    res.send({ results });
})

module.exports = {
    searchMatches
};
