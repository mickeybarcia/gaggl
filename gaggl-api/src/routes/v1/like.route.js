const express = require('express');

const { likeController } = require('../../controllers');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router
  .post('/like', verifyToken, likeController.likeUser);

router.post('/dislike', verifyToken, likeController.dislikeUser);

module.exports = router;
