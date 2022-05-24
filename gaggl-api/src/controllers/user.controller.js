const catchAsync = require('../utils/catchAsync');
const { userService, locationProducer, imageStorageService } = require('../services');
const { NotFoundError } = require('../errors');
const { createTestUsers: createUsers } = require('../utils/testing');

const createUser = catchAsync(async (req, res) => {
    const { location } = req.body;
    const user = await userService.createUser(req.body);
    const { id: userId } = user;
    await locationProducer.sendNewUserUpdate({ location, userId })
    res.send(user);
});

const getCurrentUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.userId);
    if (!user) throw new NotFoundError('User not found');
    res.send(user);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) throw new NotFoundError('User not found');
    res.send(user);
});

const getUsers = catchAsync(async (req, res) => {
    const { userIds } = req.body;
    const users = await userService.getUsersByIds(userIds);
    res.send(users);
});

const updateProfile = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { profile } = req.body;
    const user = await userService.updateProfileByUserId({ userId, profile });
    res.send(user);
});

const addTag = catchAsync(async (req, res) => {
    const { tag } = req.params;
    const { userId } = req;
    const user = await userService.addTagByUserId({ userId, tag });
    res.send(user);
});

const removeTag = catchAsync(async (req, res) => {
    const { tag } = req.params;
    const { userId } = req;
    const user = await userService.removeTagByUserId({ userId, tag });
    res.send(user);
});

const addProfilePic = catchAsync(async (req, res) => {
    const { file, userId } = req;
    await imageStorageService.saveImage(file.buffer, userId) 
    res.send({});
});

const getProfilePic = catchAsync(async (req, res) => {
    const { userId } = req.params;
    try {
        const buffer = await imageStorageService.getImage(userId) 
        res.type('png');
        res.end(buffer);
    } catch (error) {
        if (error.code == 404) throw new NotFoundError('Image not found')
        throw error
    }
});

const createTestUsers = catchAsync(async (req, res) => {
    const users = await createUsers();
    res.send(users);
});

module.exports = {
    createUser,
    getCurrentUser,
    getUser,
    updateProfile,
    addProfilePic,
    getProfilePic,
    addTag,
    createTestUsers,
    removeTag,
    getUsers
};
