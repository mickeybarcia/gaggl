const express = require('express');

const { searchController } = require('../../controllers');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, searchController.searchMatches);

module.exports = router;
