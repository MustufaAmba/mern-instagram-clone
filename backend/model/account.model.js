const mongoose = require("mongoose")
const accountSchema = new mongoose.Schema({
        accountId:{
            type:mongoose.Schema.Types.ObjectId,
            index:true,
            auto:true
        },
        mobileNumber:{
            type:String,
            required:true,
            minLength:[10,'mobile number should be minimum 10 characters long'],
            maxLength:[10,'mobile number should be maximum 10 characters long']
        },
        fullName:{
            type:String,
            maxLength:[100,'full name should not be more than 100 characters']
        },
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            maxLength:[30,'username name should not have more than 30 characters']
        },
        password:{
            type:String,
            required:true
        },
        dob:{
            type:Date,
            required:true
        }
},{     timestamps: true })
module.exports= mongoose.model('Account',accountSchema)