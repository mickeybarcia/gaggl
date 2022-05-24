const express = require('express');
const multer  = require('multer');

const { userController } = require('../../controllers');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router
  .route('/')
  .post(userController.createUser);
  
router.get('/', verifyToken, userController.getCurrentUser);

router
  .route('/createSample')
  .post(userController.createTestUsers);

router
  .route('/:userId')
  .get(userController.getUser);

router
  .route('/profile')
  .put(userController.updateProfile);

router.post('/profile/pic', verifyToken, upload.single('page'), userController.addProfilePic);
router.get('/profile/pic/:userId', verifyToken, userController.getProfilePic);

router.post('/tags/:tag', verifyToken, userController.addTag);
router.delete('/tags/:tag', verifyToken, userController.removeTag);

module.exports = router;
