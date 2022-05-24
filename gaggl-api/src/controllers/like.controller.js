const catchAsync = require('../utils/catchAsync');
const { sendUserLikeUpdate } = require('../services/likeProducer');

const likeUser = catchAsync(async (req, res) => {
    const { likee } = req.body;
    const liker = req.userId;
    await sendUserLikeUpdate({ liker, likee });
    res.sendStatus(202);
});

const dislikeUser = catchAsync(async (req, res) => {
    const { likee } = req.body;
    const liker = req.userId;
    await sendUserLikeUpdate({ liker, likee, isDislike: true });
    res.sendStatus(202);
});

module.exports = {
    likeUser,
    dislikeUser
};
