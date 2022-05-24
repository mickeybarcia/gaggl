const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const ENV = process.env.NODE_ENV;
const DEV_ENV = 'development'
const PROD_ENV = 'production'
const TEST_ENV = 'test'
const LOCAL_ENV = 'local'
const STAGING_ENV = 'staging'

const shared = {
    env: ENV,
    port: process.env.PORT,
    testUserId: '6109fed64c40ad6a1fb41a14',
    mongoose: {
        host: process.env.DB_HOST,
        dbName: 'gaggl',
        username: process.env.DB_USER,
        password: process.env.DB_PW,
        options: {
            useNewUrlParser: true, 
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    },
    elastic: {
        node: process.env.ELASTIC_HOST,
        maxRetries: 5,
        requestTimeout: 6000,
        docType: '_doc',
        index: process.env.ELASTIC_INDEX
    },
    kafka: {
        brokers: process.env.KAFKA_BROKERS.split(',')
    },
    imageStorage: {
        storageKey: process.env.STORAGE_KEY,
        projectId: process.env.STORAGE_PROJECT
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
}

const local = {
    ...shared,
};

const development = {
    ...shared
}

const test = { 
    ...development 
}
test.env = TEST_ENV

const production = { 
    ...shared 
}

const staging = { 
    ...production 
}
staging.env = STAGING_ENV

const config = {
    local,
    development,
    test,
    staging,
    production
};

module.exports = config[ENV];
module.exports.DEV_ENV = DEV_ENV
module.exports.PROD_ENV = PROD_ENV
module.exports.TEST_ENV = TEST_ENV
module.exports.LOCAL_ENV = LOCAL_ENV
module.exports.STAGING_ENV = STAGING_ENV