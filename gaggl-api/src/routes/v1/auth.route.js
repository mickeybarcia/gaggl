const express = require('express');

const { authController } = require('../../controllers');

const router = express.Router();

router
  .route('/signUp')
  .post(authController.signUp);

router
  .route('/signIn')
  .post(authController.signIn);

router
  .post('/signOut', authController.signOut);

router
  .route('/refreshToken')
  .post(authController.refreshToken);

module.exports = router;
