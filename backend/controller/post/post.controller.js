const express= require("express")
const Post = require("../../domain/post.domain")
const { validateParams } = require("../../middleware/validateId")
const router= express.Router()
const comment = require("./comment/comment.controller")
const like = require("./like/like.controller")
router.use('/:postId/like',like)
router.use('/comment',comment)
router.post("/",Post.addPost)

module.exports = router