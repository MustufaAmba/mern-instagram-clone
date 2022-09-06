const mongoose = require("mongoose")
const jwt  = require("jsonwebtoken")
require('dotenv').config()
const loginSchema = new mongoose.Schema({
    loginId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        lowercase: true,
        maxLength: [30, 'userName name should not have more than 30 characters'],
        default:null
    },
    mobileNumber:{
        type: String,
        minLength: [10, 'mobile number should be minimum 10 characters long'],
        maxLength: [10, 'mobile number should be maximum 10 characters long'],
        default:null
    },
    password: {
        type: String,
        required: true
    }

},{timestamps:true})
loginSchema.methods.generateToken = function () {
    return jwt.sign({
            userName: this.userName,
            userId: this.userId
        },process.env.SECRET_TOKEN,
        {
            expiresIn: '7d'
        })
}
module.exports = mongoose.model('Login', loginSchema)