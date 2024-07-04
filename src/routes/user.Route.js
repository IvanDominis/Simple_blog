const router = require('express').Router();
const userController = require('../controllers/user.Controller');
const authMiddleware = require('../middleware/auth.Middleware');


router.get('/profile/:id', authMiddleware.verifyToken, userController.getUserProfile);

router.post('/update', authMiddleware.verifyToken, userController.updateUserProfile);

router.post('/change-password', authMiddleware.verifyToken, userController.changePassword);
// delete a user
router.get('/delete/:id',authMiddleware.verifyAdminAndToken, userController.deleteUser);


module.exports = router;