const mongoose = require("mongoose")
const otpSchema = new mongoose.Schema({
    mobileNumber:{
        type:String,
        minLength:[10,'mobile number should be minimum 10 characters long'],
        maxLength:[10,'mobile number should be maximum 10 characters long'],
        required:true,
        index:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{expireAfterSeconds:600}
    }
},{timeStamps:true})
module.exports = mongoose.model('Otp',otpSchema)