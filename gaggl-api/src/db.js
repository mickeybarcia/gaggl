const mongoose = require('mongoose');

const config = require('./config');
const logger = require('./logger');

const {
    username,
    password,
    host,
    dbName,
    options
} = config.mongoose;

if (config.env != config.TEST_ENV) {
    mongoose.connect(
        `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`, 
        options, 
        (err) => {
            if (err) throw err;
        }
    );
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            process.exit(0);
        });
    });
}