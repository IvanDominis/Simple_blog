const User = require('../models/user.Model');
const Post = require('../models/post.Model');
const bcrypt = require('bcryptjs');
const userController = {

    getUserProfile: async (req, res) => {
        try {
            const rs = await User.findById(req.user._id);
            const { password, ...user } = rs._doc;
            res.status(200).render('profile', { title: 'Profile', user: user });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateUserProfile: async (req, res) => {
        const id =  req.user._id.toHexString()
        try {
            const user = await User
                .findByIdAndUpdate(id, {
                    fullname: req.body.fullname,
                    phone: req.body.phone,
                    address: req.body.address
                });
            res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    changePassword: async (req, res) => {
        try {
            const user = await User.findOne({username: req.user.username});
            if(!user){
                return res.status(404).json({message: 'User not found or Wrong username'});
            }
            // check if the password is correct
            const validPassword = await bcrypt.compare(req.body.oldPass, user.password);
            if(!validPassword){
                return res.status(404).json({message: 'Wrong password'});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPass, salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json('Password updated successfully');
        } catch (err) {
            return res.status(500).json({ message: err });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            if (req.user.admin == true) {
                return res.status(200).json('User has been deleted by admin');
            }
            res.locals.user = null;
            res.clearCookie("refreshToken");
            return res.status(200).redirect('/login');
        }catch(err){
            return res.status(500).json(err);
        }
    }

};

module.exports = userController;