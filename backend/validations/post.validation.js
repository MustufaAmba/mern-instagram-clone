const Joi = require("joi")
const contentSchema = Joi.object({
    images:Joi.array().items(Joi.string()),
    videos:Joi.array().items(Joi.string())
})
const postValidate = (body)=>{
    const postSchema  = Joi.object({
        userId:Joi.number().required(),
        content:contentSchema,
        caption: Joi.string().max(2200).min(0).allow(null),
        location:Joi.string().allow(null),
        disableLikeCount:Joi.boolean(),
        disableComment:Joi.boolean(),
        isArchived:Joi.boolean(),
        likes:Joi.array().items(Joi.number()),
        comments: Joi.array().items(Joi.number()),
        tags:Joi.array().items(Joi.number()),
    })
    return postSchema.validate(body)
}

module.exports =postValidate