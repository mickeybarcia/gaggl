const mongoose = require('mongoose');

const { BadRequestError, NotFoundError } = require('../errors')
const { User } = require('../models');

const getUserByEmail = async (email) => User.findOne({ email });

const getUsersByIds = async (ids) => User.find({ _id: ids });

const createUser = async (user) => {
  if (await User.isEmailTaken(user.email)) {
    throw new BadRequestError('Email already taken');
  }
  return await User.create(user);
};

const getUserById = async (id) => {
  const user = User.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
};

const updateProfileByUserId = async ({ userId, profile }) => {
  const user = await getUserById(userId);
  Object.assign(user, { profile });
  await user.save();
  return user;
};

const addTagByUserId = async ({ userId, tag }) => {
  const user = await getUserById(userId);
  user.tags.push(tag);
  await user.save();
  return user;
};

const removeTagByUserId = async ({ userId, tag }) => {
  const user = await getUserById(userId);
  user.tags.pull(tag)
  return await user.save();
};

const getUsersByIdsAndTagMatchesQuery = ({ userIds, tagsToSearch }) => [
  { $match: { _id: { $in: userIds } } },
  {
    $project: { 
      _id: "$_id",
      matchCount: {
        $size: { 
          $cond: [ 
              { $isArray: "$tags" }, 
              { $setIntersection : [ tagsToSearch, '$tags' ] }, 
              []
          ]
        }
      },
    } 
  },
  { $sort: { matchCount: -1 } },
];

const getUsersByIdsAndTagMatches = async ({ userIds, tags: tagsToSearch }) => {
  userIds = userIds.map(id => mongoose.Types.ObjectId(id))
  return User.aggregate(getUsersByIdsAndTagMatchesQuery({ userIds, tagsToSearch }));
};

module.exports = {
  createUser,
  getUserById,
  updateProfileByUserId,
  addTagByUserId,
  getUsersByIdsAndTagMatches,
  removeTagByUserId,
  getUsersByIds,
  getUserByEmail
};
