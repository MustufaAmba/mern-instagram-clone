const Joi = require("joi")

const accountValidate = (body)=>{
    const accountSchema = Joi.object({
        mobileNumber: Joi.string().min(10).max(10).required(),
        fullName:Joi.string().max(100),
        userName:Joi.string().max(30).required(),
        password:Joi.string().min(6).max(40).required(),
        dob:Joi.date().less('now').raw().required(),
        otp:Joi.string().max(6).min(6).required()
    })
    return accountSchema.validate(body)
}
const loginValidate = (body)=>{
    const loginSchema = Joi.object({
        loginId:Joi.string().max(30).required(),
        password:Joi.string().min(6).max(40).required(),
        otp:Joi.string().allow(null,''),
        location:Joi.object({
            longitude:Joi.string(),
            latitude:Joi.string()
        })
    })
    return loginSchema.validate(body)
}
const passwordValidate = (body)=>{
    const passwordSchema = Joi.object({
        accountId:Joi.string().required(),
        newPassword:Joi.string().min(6).required(),
        confirmNewPassword:Joi.string().valid(Joi.ref('newPassword')).required()
    })
    return passwordSchema.validate(body)
}
module.exports = {accountValidate,loginValidate,passwordValidate}