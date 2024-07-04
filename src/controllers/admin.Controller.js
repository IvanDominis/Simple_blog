const User = require('../models/user.Model');
const Post = require('../models/post.Model');
const adminController = {
    getAdminPage: (req, res) => {
        res.render('admin', { title: 'Admin Page' });
    },
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find();
            res.status(200).render('admin/allUsers', { title: 'All Users', users: users });

        }catch(err){
            return res.status(500).json(err);
        }
    },
    getAllPosts: async (req, res) => {
        try{
            const posts = await Post.find();
            res.status(200).render('admin/allPosts', { title: 'All Posts', posts: posts });
        }catch(err){
            return res.status(500).json(err);
        }
    }
}

module.exports = adminController;