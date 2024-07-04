const mongoose = require('mongoose');

// create a schema for the user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    fullname: {
        type: String,
        default: '',
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        default: '',
        minlength: 8,
        maxlength: 15
    },
    address: {
        type: String,
        default: '',
        minlength: 3,
        maxlength: 100
    }
},{ timestamps: true });

module.exports = mongoose.model('Users', userSchema);