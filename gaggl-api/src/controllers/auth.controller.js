const catchAsync = require('../utils/catchAsync');
const { userService, locationProducer, authTokenService } = require('../services');
const { UnAuthorizedError } = require('../errors')

const signUp = catchAsync(async (req, res) => {  // TODO remove
    const { location } = req.body;
    const user = await userService.createUser(req.body);
    const userId = user._id;
    // create email token
    // send verification email
    await locationProducer.sendNewUserUpdate({ location, userId });
    const tokens = getNewTokens(userId);
    res.send({ user, ...tokens });
});

const signOut = catchAsync(async (req, res) => {
    // TODO
    res.sendStatus(200)
});

const signIn = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (user && await user.isPasswordMatch(password)) {
        const tokens = getNewTokens(user._id);
        res.send({ user, ...tokens })
    } else {
        throw new UnAuthorizedError('Email or password not correct');
    }
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const { id: userId } = authTokenService.verifyRefreshToken(refreshToken);
    if (userId) {
        const tokens = getNewTokens(userId);
        res.send(tokens);
    }
});

const getNewTokens = (userId) => { 
    const token = authTokenService.generateToken(userId);
    const refreshToken = authTokenService.generateRefreshToken(userId);
    return { token, refreshToken };
 };

module.exports = {
    signUp,
    signIn,
    signOut,
    refreshToken
};
