const express= require("express")
const Post = require("../../../domain/post.domain")
const { validateParams } = require("../../../middleware/validateId")
const router= express.Router({mergeParams:true})
router.post("/",Post.addComment)
router.get("/:postId",validateParams,Post.getComments)
router.get("/replyComment/:commentId",validateParams,Post.getReplyComments)
router.post("/replyComment/:commentId",validateParams,Post.addReplyComment)
module.exports = router