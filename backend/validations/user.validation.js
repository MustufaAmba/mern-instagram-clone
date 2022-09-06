const Joi = require("joi")
const userValidate = (body)=>{
    const userSchema  = Joi.object({
        fullName: Joi.string(),
        posts:Joi.array().items(Joi.number()),
        mobileNumber: Joi.string().min(10).max(10),
        userName:Joi.string().max(30),
        password:Joi.string().min(6),
        website:Joi.string().allow(null),
        bio: Joi.string().allow(null),
        email:Joi.string().email(),
        gender:Joi.string().valid('Male','Female','Other').insensitive().allow(null),
        profileImage: Joi.string().allow("").allow(null),
        savedPosts:Joi.array().items(Joi.string()),
        taggedPosts: Joi.array().items(Joi.string()),
        dob:Joi.date().less('now').raw(),
        isPrivate:Joi.boolean(),
        newPassword:Joi.string().min(6),
    })
    return userSchema.validate(body)
}

module.exports = {userValidate}