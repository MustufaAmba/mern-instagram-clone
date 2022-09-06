const express = require("express")
const Message = require("../../../domain/message.domain")
const { validateParams } = require("../../../middleware/validateId")
const router = express.Router({mergeParams:true})
router.post("/",validateParams,Message.sendMessage)
router.get("/",validateParams,Message.fetchAllMessages)
module.exports = router