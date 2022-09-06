const mongoose = require("mongoose")
const commentSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        index:true,
        unique:true
    },
    postId:{
        type:Number,
        required:true
    },
    userId:{
        type:Number,
        required:true
    },
    content: {
        type:String,
        maxLength: [2200, 'comment should not have more than 2200 characters'],
        default:null
    },
    isDeleted: {
        type: Boolean,
        default:false
    },
    likes:[{
        type:Number,
        default:null
    }],
    commentReplies:[{
        type:Number,
        default:null
    }],
    parent:{
        type:Number,
        default:null
    }
}, { timestamps: true })

commentSchema.virtual('virtualCommentUser',{
    ref:'User',
    localField:'userId',
    foreignField:'userId',
    justOne:true
})
commentSchema.virtual('virtualCommentPost',{
    ref:'Post',
    localField:'postId',
    foreignField:'postId',
    justOne:false   
})
commentSchema.virtual('virtualLikes',{
    ref:'User',
    localField:'likes',
    foreignField:'userId',
    justOne:false
})
commentSchema.virtual('virtualCommentReplies',{
    ref:'Comment',
    localField:'commentReplies',
    foreignField:'commentId',
    justOne:false
})

commentSchema.set('toObject', { virtuals: true });
commentSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Comment', commentSchema)