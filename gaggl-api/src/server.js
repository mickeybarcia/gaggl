const express = require('express');
const passport = require('passport');
const cors = require('cors');

const config = require('./config');
const { NotFoundError } = require('./errors');
const routes = require('./routes/v1');
const { errorHandler } = require('./middlewares/error');
const logger = require('./logger');
const db = require('./db')  // run mongoose connect
const { likeProducer, locationProducer } = require('./services')

locationProducer.start()
likeProducer.start()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({
    type: 'image/png',
    limit: '100mb'
}));

app.use(cors());

app.use('/api/v1', routes);

app.use((req, res, next) => {
    next(new NotFoundError('Route Not found'));
});
  
app.use(errorHandler);

app.get('/', (req, res, next) => {
    res.send('welcome to gaggl user api');
});

app.listen(process.env.PORT, () => console.log('gaggl user api listening on portttt ' + process.env.PORT));

module.exports = app;