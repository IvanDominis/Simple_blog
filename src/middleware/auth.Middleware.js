const jwt = require('jsonwebtoken');
const User = require('../models/user.Model');  
const { authController } = require('../controllers/auth.Controller');
require('dotenv').config();
const authMiddleware = {

    //verify token
    verifyToken: async (req, res, next) => {    
        const token = req.cookies.refreshToken;
        if(token){
            jwt.verify(token, process.env.JWT_REFRESH_TOKEN, async(err, user) => {
                if (err) {
                    return res.status(403).redirect('/login');
                }
                const results = await User.findById(user.id);
                const { password, ...others } = results._doc;
                req.user = others;
                next();
            });
        }
        else {
            return res.status(401).redirect('/login');// Redirect to login page;
        }
    }, 
    checkUser: (req, res, next) => {
        const token = req.cookies.refreshToken;
        if(token){
            jwt.verify(token, process.env.JWT_REFRESH_TOKEN, async (err, decodedToken) => {
                if(err){
                    console.log(err);
                    res.locals.user = null;
                    next();
                }
                let results = await User.findById(decodedToken.id);
                const { password, fullname, phone, address, ...others } = results._doc;
                res.locals.user = others;
                next();
            });
        }
        else {
            res.locals.user = null;
            next();
        }
    },
    verifyAdminAndToken: async (req, res, next) => {
        authMiddleware.verifyToken(req, res, () => {
            if (req.user.admin || req.user._id.toHexString() === req.params.id) {
                next();
            }else{
                return res.status(403).json('You are not allowed to do that');
            }
        });
    }
} 

module.exports = authMiddleware;