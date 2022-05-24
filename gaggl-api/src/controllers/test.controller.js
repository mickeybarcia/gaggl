const catchAsync = require('../utils/catchAsync');

const exampleFunction = catchAsync(async (req, res) => {
    res.sendStatus(200)
});

module.exports = {
    exampleFunction
}