const redis = require('redis');
const { promisify } = require("util");

const { redis: { host, port } } = require('../config');

const client = redis.createClient({ host, port });

const lrangeAsync = promisify(client.lrange).bind(client);

client.on('error', err => {
    console.log('error ' + err);
});

const getCheckedUserIds = async (userId) => {
    return await lrangeAsync(userId, 0, -1);
}

module.exports = {
    getCheckedUserIds
};
