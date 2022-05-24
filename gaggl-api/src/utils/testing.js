const { sendUserLikeUpdate } = require('../services/likeProducer');
const { sendNewUserUpdate } = require('../services/locationProducer');
const { User, Match } = require('../models');
const { elasticService } = require('../services');
const { testUserId } = require('../config');

const testUsers = [
    {
        _id: testUserId,
        name: 'Mickey',
        age: 25,
        email: 'mickey@mickey.com',
        password: 'mickey1',
        location: {
          lat: 45.12,
          lon: -71.34
        },
        tags: ['food', 'skating', 'coding', 'hats']
    },
    {
        name: 'Jojo',
        age: 42,
        email: 'mickey@mickey1.com',
        password: 'mickey1',
        location: {
          lat: 45.12,
          lon: -71.34
        },
        tags: ['crying', 'anime', 'skating', 'candy']
    },
    {
        name: 'Pikachu',
        age: 25,
        email: 'mickey@mickey2.com',
        password: 'mickey1',
        location: {
          lat: 45.12,
          lon: -71.34
        },
        tags: ['wizards', 'candy', 'anime', 'vampires']
    },
    {
        name: 'Cardi',
        age: 30,
        email: 'mickey@mickey3.com',
        password: 'mickey1',
        location: {
          lat: 45.12,
          lon: -71.34
        },
        tags: ['blood', 'candy', 'food', 'rapping']
    },
    {
        name: 'Plop',
        age: 27,
        email: 'mickey@mickey4.com',
        password: 'mickey1',
        location: {
          lat: 46.12,
          lon: -71.34
        },
        tags: ['knitting', 'cooking', 'free britney', 'clothes']
    },
    {
        name: 'Bobobo',
        age: 22,
        email: 'mickey@mickey5.com',
        password: 'mickey1',
        location: {
          lat: 46.12,
          lon: -71.34
        },
        tags: ['lemons', 'nicolas cage', 'cats']
    }
];

module.exports.createTestUsers = async () => {
  await User.collection.drop();
  await Match.collection.drop();
  await elasticService.deleteAllDocuments();
  const users = await Promise.all(testUsers.map(user => User.create(user)));
  for (user of users) {
    await sendNewUserUpdate({ userId: user._id, location: user.location })
    for (otherUser of users) {
      if (Math.floor(Math.random() * 2) && user._id !== otherUser._id) {
        await sendUserLikeUpdate({ 
          liker: user._id, 
          likee: otherUser._id
        })
        console.log(user.name + ' liked ' + otherUser.name)
      }
    }
  }
  return users;
}