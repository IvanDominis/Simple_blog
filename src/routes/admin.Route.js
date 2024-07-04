const adminController = require('../controllers/admin.Controller');
const authMiddleware = require('../middleware/auth.Middleware');
const userController = require('../controllers/user.Controller');
const postController = require('../controllers/post.Controller');
const router = require('express').Router();

router.get('/profile', authMiddleware.verifyAdminAndToken, userController.getUserProfile);

router.get('/getAllUsers', authMiddleware.verifyAdminAndToken, adminController.getAllUsers);

router.get('/getAllPosts', authMiddleware.verifyAdminAndToken, adminController.getAllPosts);

router.delete('/deleteUser/:id', authMiddleware.verifyAdminAndToken, userController.deleteUser);

router.put('/editPost/:id', authMiddleware.verifyAdminAndToken, postController.editPost);

router.delete('/deletePost/:id', authMiddleware.verifyAdminAndToken, postController.deletePost);

module.exports = router;