const router = require("express").Router();
const Post = require("../models/post.Model");

const guestController = {

    getHomepage: async (req,res) => {
        const posts = await Post.find().sort({createdAt: -1});
        return res.render("home", {posts: posts, title: "Home"})
    },
    getAboutPage: (req, res) => {
        res.render('about',{title: "About"})
    },
    getContactPage: (req, res) => {
        res.render('contact',{title: "Contact"})
    },
    getPostPage: async (req, res) => {
        const post = await Post.findById(req.params.id);
        res.render('post', {post: post, title: post.title})
    },
    getLoginPage: (req, res) => {
        res.render('login', { title: "Login" })
    },
    getRegisterPage: (req, res) => {
        res.render('register', {title: "Register"})
    }
};


module.exports = guestController;