const Joi = require("joi")

const validateReqId = (body)=>{
    const idSchema = Joi.object({
        userId: Joi.number().min(1),
        targetId:Joi.number().min(1),
        postId:Joi.number().min(1),
        accountId:Joi.number().min(1),
        chatId:Joi.number().min(1),
        messageId:Joi.number().min(1),
        commentId:Joi.number().min(1),
        senderId:Joi.number().min(1),
        requestId:Joi.number().min(1),
        userIds:Joi.array().items(Joi.number().min(1))
    })
    return idSchema.validate(body,{allowUnknown:true})
}
module.exports = validateReqId