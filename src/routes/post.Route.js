const authMiddleware = require('../middleware/auth.Middleware');
const postController = require('../controllers/post.Controller');
const router = require('express').Router();


router.get("/", authMiddleware.verifyToken , postController.getComposePage);

router.post("/", authMiddleware.verifyToken, postController.createPost);


module.exports= router;