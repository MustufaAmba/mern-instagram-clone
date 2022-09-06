const {randomInt} = require('crypto');
const getIncrementedId = async(collection,column)=>{
    let sortObject = {}
    sortObject[column]=-1
    const counter = await collection.findOne().sort(sortObject).limit(1) 
    return (counter && counter[column])||0
}
const errorHandler = (error,req,res,next)=>{
    if(error)
    {
        res.status(500).json({message:error.message})
        return 
    }
}
const generateOTP = ()=>{
    return randomInt(100000,1000000).toString()
}

module.exports = {getIncrementedId,errorHandler,generateOTP}