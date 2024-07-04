const bcrypt = require('bcryptjs');
const User = require('../models/user.Model');
const jwt = require('jsonwebtoken');
const guestController = require('./guest.Controller');
require('dotenv').config();

refreshTokens = [];

const authController = {

    // register user
    registerUser: async (req, res, next) => {
        try {
            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // create a new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                admin: req.body.admin || false,
                fullname: req.body.fullname || null,
                phone: req.body.phone || null,
                address: req.body.address || null
            });
            // save the user to database
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);

        } catch (error) {
            res.status(500).json({message: error.message});
        }

    },

    // generate new access token
    generateAccessToken: (user) =>{
        return jwt.sign({
            id: user.id, 
            admin: user.admin
        }, 
        process.env.JWT_SECRET_KEY, 
        {expiresIn: '3h'});
    },

    // generate new refresh token
    generateRefreshToken: (user) =>{
        return jwt.sign({
            id: user.id, 
            admin: user.admin
        }, 
        process.env.JWT_REFRESH_TOKEN, 
        {expiresIn: '30d'});
    },


    // login user
    loginUser: async (req, res, next) => {
        try{
            // check if the user exists
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(404).json({message: 'User not found or Wrong username'});
            }

            // check if the password is correct
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword){
                return res.status(404).json({message: 'Wrong password'});
            }

            if (user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                // new code
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // if in production, set to true
                    path: "/",
                    // sameSite: "restrict"
                });
                const { password, ...others } = user._doc;
                return res.status(200).json({ user: user._id ,accessToken: accessToken});
            }

        }catch(error){
            return res.status(500).json({message: error.message});
        }
    },
    // 3 WAYS TO STORE TOKENS: 1. In localstorage(XSS attack), 2. In HTTPONLY COOKIES (CSRF->same site), 3. Redux store
    // Best way: Backend for frontend  
    
    requestRefreshToken: async (req, res) => {
        // Take refresh token from the cookie of user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You are not authenticated");
        if (!refreshTokens.includes(refreshToken)) 
            return res.status(403).json("Refresh token is not valid");
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid");
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false, // if in production, set to true
                path: "/" 
                // sameSite: "strict"
            });
            return res.status(200).json({accessToken: newAccessToken});
        });
    },

    // logout user
    logoutUser: async (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.clearCookie("refreshToken");
        return res.status(200).redirect('/login');
    }
};

module.exports =  authController ;