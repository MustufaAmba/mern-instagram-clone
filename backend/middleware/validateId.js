const validateReqId = require("../validations/common.validation")
const validateBody = (req,res,next)=>{

    var {error} = validateReqId(req.body)
    if(error)
    {
        return res.status(400).json({message:`${Object.keys(error._original)[0]} should be in positive integer format`})
    } 
    return next()
}
const validateParams = (req,res,next)=>{
    let obj={}
        Object.keys(req.params).forEach(params=>{
        obj[`${params}`] = parseInt(req.params[`${params}`])
    })
    var {error} = validateReqId(obj)
    if(error)
    {
        return res.status(400).json({message:`Bad params format ${Object.keys(error._original)[0]} should be in positive integer format`})
    }
    return next()
}
module.exports = {validateBody,validateParams}