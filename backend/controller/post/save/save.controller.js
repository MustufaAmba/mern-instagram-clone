const express= require("express")
const Post = require("../../../domain/post.domain")
const { validateParams, validateBody } = require("../../../middleware/validateId")
const router= express.Router({mergeParams:true})
router.post("/",[validateParams,validateBody],Post.addSavePost)
router.delete("/",[validateParams,validateBody],Post.deleteSavePost)
module.exports = router