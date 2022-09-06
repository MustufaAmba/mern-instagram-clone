const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    messageId:{
        type:Number,
        required:true,
        index:true,
        unique:true
    },
    chatId:{
        type:Number,
        required:true,
    },
    content:{
        type:String,
        required:true,
        maxLength:[1000,'maximum 1000 characters are allowed']
    },
    senderId:{
        type:Number,
        required:true
    }
},{timestamps:true})

messageSchema.virtual('senderIdVirtual',{
    ref:'User',
    localField:'senderId',
    foreignField:'userId',
    justOne:false
})
messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Message',messageSchema)