const Post = require("../model/post.model")
const User = require("../model/user.model")
const postValidate = require("../validations/post.validation")
const { getIncrementedId } = require("../commonFunctions")
const Comment = require("../model/comment.model")
const validateComment = require("../validations/comment.validations")
const connection = require("../connection")
class PostDomain {
    static async addPost(req, res, next) {
        const session = await connection.startSession()
        try {
            session.startTransaction()
            const { error } = postValidate(req.body)
            if (error) {
                res.status(400).json({ message: error.details[0].message })
                return
            }
            let count = await getIncrementedId(Post, 'postId')
            const post = await Post.create([{ ...req.body, postId: ++count }],{session})
            await User.findOneAndUpdate(
                { userId: req.body.userId }
                , { $push: { posts: post[0].postId } }, { new: true ,session})
                await session.commitTransaction()
              const populatedPost = await Post.populate(post,{path:"virtualUser",select:"userId userName profileImage"})
            res.status(200).json({ message: "post created successfully", data: populatedPost })
        }
        catch (error) {
            await session.abortTransaction()
            next(error)
        }
        session.endSession()
    }
    static async addComment(req, res, next) {
        const session = await connection.startSession() 
        try {
            session.startTransaction()
            const { error } = validateComment(req.body)
            if (error) {
                res.status(400).json({ message: error.details[0].message })
                return
            }
            let counter = await getIncrementedId(Comment, 'commentId')
            const commentData = {
                ...req.body,
                commentId: ++counter,
                postId: parseInt(req.body.postId)
            }
            const comment = await Comment.create([commentData],{session})
             await Post.findOneAndUpdate({ postId: comment[0].postId },
                { $push: { comments: comment[0].commentId } }, { new: true,session })
            const populateComment = await Comment.populate(comment,{path:"virtualCommentUser",select:"userId userName profileImage"})
                await session.commitTransaction()
            res.status(200).json({ message: "success", data: populateComment })
        }
        catch (error) {
            await session.abortTransaction()
            next(error)
        }
        session.endSession()
    }
    static async addReplyComment(req, res, next) {
        const session = await connection.startSession()
        try {
           session.startTransaction()
            const { error } = validateComment(req.body)
            if (error) {
                res.status(400).json({ message: error.details[0].message })
                return
            }
            let counter = await getIncrementedId(Comment, 'commentId')
            const commentData = {
                ...req.body,
                commentId: ++counter,
                postId: parseInt(req.body.postId),
                parent: parseInt(req.params.commentId)
            }
            const comment = await Comment.create([commentData],{session})

            const replyTo = await Comment.findOneAndUpdate(
                { commentId: parseInt(req.params.commentId) },
                { $push: { commentReplies: comment[0].commentId } }, { new: true,session }
            )

            await Post.findOneAndUpdate({ postId: comment[0].postId },
                { $push: { comments: comment[0].commentId } }, { new: true ,session})
                await session.commitTransaction()
            res.status(200).json({ message: "success", data: comment })

        }
        catch (error) {
            await session.abortTransaction()
            next(error)
        }
        session.endSession()
    }
    static async getComments(req, res, next) {
        try {
            const comments = await Comment.find(
                { postId: parseInt(req.params.postId),parent:null }, { isDeleted: 0 }
            ).populate('virtualCommentUser','userId userName profileImage').sort({ "updatedAt": -1 })
            res.status(200).json({
                message: "success",
                data: comments
            })
        }
        catch (error) {
            next(error)
        }
    }
    static async getReplyComments(req, res, next) {
        try {
            const comments = await Comment.findOne(
                { commentId: parseInt(req.params.commentId)}, { isDeleted: 0 }
            ).populate('virtualCommentReplies').sort({ "updatedAt": -1 })
            const replyComments = await Comment.populate(comments.virtualCommentReplies,{path:"virtualCommentUser",select:"userId userName profileImage"})
            
            res.status(200).json({
                message: "success",
                data: comments
            })
        }
        catch (error) {
            next(error)
        }
    }
    static async addLike(req, res, next) {
        try {
            const {userId} = req.body
            const post = await Post.findOneAndUpdate({ postId: parseInt(req.params.postId) },
                { $addToSet: { likes: userId} }, { new: true })
            res.status(200).json({ message: "success", data: post })
        }
        catch (error) {
            next(error)
        }
    }
    static async deleteLike(req, res, next) {
        try {
            const {userId} = req.body
            const post = await Post.findOneAndUpdate({ postId: parseInt(req.params.postId) },
                { $pullAll: { likes: [userId] } }, { new: true })
            res.status(200).json({ message: "success", data: post })
        }
        catch (error) {
            next(error)
        }
    }
    static async addSavePost(req, res, next) {
        try {
            const {userId} = req.body
            const user = await User.findOneAndUpdate({ userId },
                { $addToSet: { savedPosts: postId} }, { new: true })
            res.status(200).json({ message: "success", data: user })
        }
        catch (error) {
            next(error)
        }
    }
    static async deleteSavePost(req, res, next) {
        try {
            const {userId} = req.body
            const user = await User.findOneAndUpdate({ userId },
                { $pullAll: { savedPosts: [postId] } }, { new: true })
            res.status(200).json({ message: "success", data: user })
        }
        catch (error) {
            next(error)
        }
    }
    static async getLikes(req, res, next) {
        try {
            const post = await Post.findOne({ postId: parseInt(req.params.postId) }, { postId: 1, likes: 1 })
                .populate({path:'virtualLikes',select:"userName userId profileImage"})
            res.status(200).json({ message: "success", data: post })
        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = PostDomain