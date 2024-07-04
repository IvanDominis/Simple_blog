const User = require('../models/user.Model');
const Post = require('../models/post.Model');
const { get } = require('mongoose');

const postController = {
    getComposePage: (req, res) => {
        res.render('compose',{title: "Compose"})
    },
    getBlogListPage: async (req, res) => {
        const posts = await Post.find({author: req.user.username});
        res.render('userBlogs', { posts: posts, title: "Your Blogs"});
    },
    createPost: async (req, res) => {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });
        try{
            const savedPost = await newPost.save();
            return res.status(200).json(savedPost);
        }catch(err){
            return res.status(500).json(err);
        }
    },
    editPost: async (req, res) => {
        try{
            const post = await Post.findById(req.params.id);
            post.title = req.body.title;
            post.content = req.body.content;
            const updatedPost = await post.save();
            return res.status(200).json({ message: "Post has been updated"});
        } catch (err) {
            return res.status(500).json(err);
        }

    },
    deletePost: async (req, res) => {
        try{
            const post = await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Post has been deleted');
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = postController;