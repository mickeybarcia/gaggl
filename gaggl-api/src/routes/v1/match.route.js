const express = require('express');

const { matchController } = require('../../controllers');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router
  .get('/', verifyToken, matchController.getMatches);

router
  .get('/:matchId', verifyToken, matchController.getMatch);

module.exports = router;
