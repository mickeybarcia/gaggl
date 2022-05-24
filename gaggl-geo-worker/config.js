const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '/.env') });

const config = {
    kafka: {
        brokers: process.env.KAFKA_BROKERS.split(','),
        groupId: process.env.KAFKA_GROUP,
        topic: 'user_location',
    },
    elastic: {
        index: process.env.ELASTIC_INDEX,
        type: '_doc',
        clientConfig: {
            node: process.env.ELASTIC_HOST,
            maxRetries: 5,
            requestTimeout: 6000,
        }
    }
}

module.exports = config;