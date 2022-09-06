const express  = require("express")
const Account = require("../../domain/account.domain")
const router = express.Router()
router.post("/",Account.addAccount)
router.post("/login",Account.verifyUser)
router.post("/generateOtp",Account.generateOtp)
router.post("/verifyOtp",Account.verifyOtp)
router.get('/checkUsername/:userName',Account.checkUserName)
router.get("/findAccount/:userName",Account.findAccount)
router.post("/verify/",Account.verifyPasswordOtp)
router.patch("/password/",Account.changePassword)
router.get("/findUsers",Account.findUsers)
router.get("/",Account.getAccountDetails)
module.exports= router