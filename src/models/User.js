const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // to hash password

const UserSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // removes the white space in the string if there is any
        min: 3, // min first name length
        max: 20
    },

    username: {
        type: String,
        required: true,
        trim: true,
        unique: true, // to make every username as unique
        index: true, // so that we can find username on the basis of their index
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    hash_password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    gender: {
        type: String,
        enum: ['male', 'female', 'others']
    },

    contact: {
        type: String,
    },

    profilePicture: {
        type: String
    },

    verified: {
        type: Boolean,
        default: false,
        required: true
    }
},

{timestamps: true} 
)
 
module.exports = mongoose.model('User', UserSchema);