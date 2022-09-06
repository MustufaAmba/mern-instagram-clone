const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
  
    let nonSecurePaths = '/account'
    if(!req.path.includes(nonSecurePaths))
    {
        const token = req.header("x-auth-token")
        if (!token||token==="null") {
            return res.status(400).json({ message: "no token provided" })
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
            req.user = decoded
            return next()
        }
        catch (error) {
            return res.status(401).json({ message: "unauthorized user" })
        }
    }
    return next()
}