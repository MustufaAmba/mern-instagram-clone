const Joi = require("joi")
const chatValidate = (body)=>{
    const chatSchema = Joi.object({
        userIds:Joi.array().items(Joi.number()).required(),
        isGroup:Joi.boolean(),
        userId:Joi.number(),
        groupName:Joi.string().max(30).min(0)
    })
    return chatSchema.validate(body)
}
const messageValidate = (body)=>{
    const messageSchema = Joi.object({
        content:Joi.string().max(1000).required(),
        senderId:Joi.number().required()
    })
    return messageSchema.validate(body)
}
module.exports = {chatValidate,messageValidate}