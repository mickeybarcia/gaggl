const express = require('express');

const { locationController } = require('../../controllers');

const router = express.Router();

router
  .route('/createIndex')
  .post(locationController.createIndex);

router
  .route('/:userId')
  .delete(locationController.deleteUserLocation);

router
  .route('/')
  .post(locationController.searchUserLocation)

module.exports = router;
