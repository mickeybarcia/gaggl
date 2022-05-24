const config = require('./config');
const server = require('./server');
const logger = require('./logger');
const { locationProducer, likeProducer } = require('./services');

// let server;

const exitHandler = () => {
  // if (server) {
  //   server.close(() => {
  //     logger.info('Server closed');
  //     process.exit(1);
  //   });
  // } else {
  //   process.exit(1);
  // }
  locationProducer.stop()
  likeProducer.stop()
  // process.exit(1);
};
  
const unexpectedErrorHandler = (error) => {
    logger.info(error);
    exitHandler();
};
  
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
  
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  // if (server) {
  //   server.close();
  // }
  locationProducer.stop()
  likeProducer.stop()
});