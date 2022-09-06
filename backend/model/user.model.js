const mongoose = require("mongoose")
const RequestSchema = new mongoose.Schema({
    requestId:{
        type:Number,
        required:true
    },
    targetId:{
        type:Number,
        required:true
    },
    referenceId:{
        type:Number,
        default:null
    },
    status:{
        type:String,
        required:true,
        enum:['inProgress','accepted','rejected']
    }
},{timestamps:true})
const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        index: true,
        unique:true
    },
    posts:
        [{
            type: Number,
            default:null
        }],
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required:true
    },
    mobileNumber: {
        type: String,
        required: true,
        minLength: [10, 'mobile number should be minimum 10 characters long'],
        maxLength: [10, 'mobile number should be maximum 10 characters long']
    },
    fullName: {
        type: String,
        maxLength: [100, 'full name should not be more than 100 characters'],
        default:null
    },
    userName: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        maxLength: [30, 'username name should not have more than 30 characters']
    },
    password: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default:null
    },
    bio: {
        type: String,
        default:null
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                return emailRegex.test(v)||v===null;
            },

            message: "Please enter a valid email"
        },
        default:null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other',null],
        default:null
    },
    profileImage: {
        type: String,
        default:null
    },
    savedPosts: [{
        type: Number,
        default:null
    }],
    taggedPosts: [{
        type: Number,
        default:null
    }],
    following:[{
        type:Number,
        default:null
    }],
    followers:[{
        type:Number,
        default:null
    }],
    isPrivate:{
        type:Boolean,
        default:true
    },
    currentFollowRequest:[{
        type:RequestSchema,
        default:null
    }],
    requestInProgress:[{
        type:RequestSchema,
        default:null
    }],
        dob:{
            type:Date,
            required:true
        }
}, { timestamps: true })

userSchema.virtual('virtualPosts', {
    ref: 'Post',
    localField: 'posts',
    foreignField: 'postId',
    justOne: false
})
userSchema.virtual('virtualSavedPosts', {
    ref: 'Post',
    localField: 'savedPosts',
    foreignField: 'postId',
    justOne: false
})
userSchema.virtual('virtualTaggedPosts', {
    ref: 'Post',
    localField: 'taggedPosts',
    foreignField: 'postId',
    justOne: false
})
userSchema.virtual('virtualFollowing', {
    ref: 'User',
    localField: 'following',
    foreignField: 'userId',
    justOne: false
})
userSchema.virtual('virtualFollower', {
    ref: 'User',
    localField: 'followers',
    foreignField: 'userId',
    justOne: false
})
userSchema.virtual('virtualRequestUser', {
    ref: 'User',
    localField: 'currentFollowRequest.targetId',
    foreignField: 'userId',
    justOne: false
})
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('User', userSchema)
