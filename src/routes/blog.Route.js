const authMiddleware = require('../middleware/auth.Middleware');
const postController = require('../controllers/post.Controller');
const router = require('express').Router();

router.get("/", authMiddleware.verifyToken , postController.getBlogListPage);

router.put("/edit/:id", authMiddleware.verifyToken, postController.editPost);

router.delete("/delete/:id", authMiddleware.verifyToken, postController.deletePost);

module.exports= router;