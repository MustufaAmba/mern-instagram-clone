const express= require("express")
const Post = require("../../../domain/post.domain")
const { validateParams, validateBody } = require("../../../middleware/validateId")
const router= express.Router({mergeParams:true})
router.post("/",[validateParams,validateBody],Post.addLike)
router.delete("/",[validateParams,validateBody],Post.deleteLike)
router.get("/",validateParams,Post.getLikes)
module.exports = router