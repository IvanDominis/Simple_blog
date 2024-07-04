const authMiddleware = require('../middleware/auth.Middleware');
const authController = require('../controllers/auth.Controller');
const guestController = require('../controllers/guest.Controller');

const router = require('express').Router();
// AUTH ROUTES
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
// refresh token
router.post('/refresh', authController.requestRefreshToken);
// log out
router.get('/logout', authMiddleware.verifyToken, authController.logoutUser);

// 

module.exports = router;