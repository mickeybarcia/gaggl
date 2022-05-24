const catchAsync = require('../utils/catchAsync');
const { elasticService } = require('../services')

const createIndex = catchAsync(async (req, res) => {
    await elasticService.createGeoIndex();
    res.sendStatus(202);
})

const deleteUserLocation = catchAsync(async (req, res) => {
    const { userId } = req.params;
    await elasticService.deleteUserLocation({ userId });
    res.sendStatus(202);
})

const searchUserLocation = catchAsync(async (req, res) => {
    const { location } = req.body;
    const results = await elasticService.searchGeoIndex({ location });
    const response = results.map(({ _id: userId, _source: { location } }) => {
        return {
            userId,
            location
        }
    });
    res.send(response);
})

module.exports = {
    createIndex,
    deleteUserLocation,
    searchUserLocation
};
