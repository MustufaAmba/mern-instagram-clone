const Joi = require("joi")
const commentValidate = (body)=>{
    const commentSchema  = Joi.object({
        postId:Joi.number(),
        userId:Joi.number(),
        content:Joi.string().max(2200),
        isDeleted:Joi.boolean(),
        likes:Joi.array().items(Joi.number()),
        commentReplies: Joi.array().items(Joi.number()),
    })
    return commentSchema.validate(body)
}

module.exports =commentValidate