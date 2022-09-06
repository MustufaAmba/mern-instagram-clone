const mongoose = require("mongoose")
const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        index:true,
        unique:true
    },
    content: {
        images: [{
            type: String
        }],
        videos: [{
            type: String
        }],
    },
    caption: {
        type: String,
        maxLength: [2200, 'caption should not have more than 2200 characters'],
        default:null,
    },
    location: {
        type: String,
        default:null
    },
    disableLikeCount: {
        type: Boolean,
        default:false
    },
    disableComments: {
        type: Boolean,
        default:false
    },
    isArchived: {
        type: Boolean,
        default:false
    },
    likes:[{
        type:Number
    }],
    comments:[{
        type:Number
    }],
    tags:[{
        type:Number
    }],
    userId:{
        type:Number,
        required:true
    }
}, { timestamps: true })
postSchema.virtual('virtualUser',{
    ref:"User",
    localField:"userId",
    foreignField:"userId",
    justOne:true
})
postSchema.virtual('virtualLikes',{
    ref:'User',
    localField:'likes',
    foreignField:'userId',
    justOne:false
})
postSchema.virtual('virtualComments',{
    ref:'Comment',
    localField:'comments',
    foreignField:'commentId',
    justOne:false
})
postSchema.virtual('virtualTags',{
    ref:'User',
    localField:'tags',
    foreignField:'userId',
    justOne:false
})

postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema)

