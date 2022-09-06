const mongoose = require("mongoose")
const chatSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    lastMessage: {
        type: Number
    },
    chatCreatedUserId:{
        type:Number,
        required:true
    },
    userIds: [{
        type: Number,
        required:true
        }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName:{
        type:String,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, { timestamps: true })

chatSchema.virtual('lastMessageVirtual',{
    ref:'Message',
    localField:'lastMessage',
    foreignField:'messageId',
    justOne:true
})
chatSchema.virtual('groupMembersVirtual',{
    ref:'User',
    localField:'userIds',
    foreignField:'userId',
    justOne:false
})
chatSchema.set('toObject', { virtuals: true });
chatSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Chat',chatSchema)