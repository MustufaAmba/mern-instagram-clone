const User = require("../model/user.model");
const Post = require("../model/post.model");
const { userValidate } = require("../validations/user.validation");
const connection = require("../connection");
const Bcrypt = require("bcryptjs");
class UserDomain {
  static async getPosts(req, res, next) {
    try {
      const posts = await User.findOne(
        {
          userId: parseInt(req.params.userId),
        },
        { password: 0 }
      ).populate("virtualPosts");
      res.status(200).json({ message: "success", data: posts.virtualPosts });
    } catch (error) {
      next(error);
    }
  }
  static async followUser(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const { targetId, userId } = req.body;
      const checkPrivate = await User.findOne(
        { userId: targetId },
        { isPrivate: 1 }
      );
      if (!checkPrivate.isPrivate) {
        const Addfollowing = await User.findOneAndUpdate(
          { userId },
          { $addToSet: { following: targetId } },
          { new: true, session }
        );
        const Addfollower = await User.findOneAndUpdate(
          { userId: targetId },
          { $addToSet: { followers: userId } },
          { new: true, session }
        );
        await session.commitTransaction();
        res.status(200).json({
          status: "unfollow",
          message: "followed user successfully",
          Addfollowing,
        });
        return;
      }
      let counter1 = await getIncrementedId(targetId);
      let newTargetRequest = {
        requestId: ++counter1,
        targetId: userId,
        status: "inProgress",
      };
      const requestSent = await User.findOneAndUpdate(
        { userId: targetId },
        { $push: { currentFollowRequest: newTargetRequest } },
        { new: true, session }
      );
      let counter2 = await getIncrementedId(userId);
      let newUserRequest = {
        requestId: ++counter2,
        targetId,
        referenceId: counter1,
        status: "inProgress",
      };
      const requestProgress = await User.findOneAndUpdate(
        { userId: userId },
        { $push: { requestInProgress: newUserRequest } },
        { new: true, session }
      );
      await session.commitTransaction();
      res.status(200).json({
        status: "requested",
        message: "request sent successfully",
        newUserRequest: requestProgress,
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }
  static async editDetails(req, res, next) {
    try {
      const { error } = userValidate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      if (req.body?.password) {
        const findUser = await User.findOne({
          userId: parseInt(req.params.userId),
        });
        const comparePass = await Bcrypt.compare(
          req.body.password,
          findUser.password
        );
        if (!comparePass) {
          return res
            .status(400)
            .json({
              message:
                "Your old password is entered incorrectly please enter it again.",
            });
        }
        const salt = await Bcrypt.genSalt(10);
        const hashedPassword = await Bcrypt.hash(req.body.newPassword, salt);
        await User.findOneAndUpdate(
          { userId: parseInt(req.params.userId) },
          { password: hashedPassword }
        );
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      }
      const updatedUser = await User.findOneAndUpdate(
        { userId: parseInt(req.params.userId) },
        req.body,
        { new: true, projection: { password: 0 } }
      );
      res.status(200).json({ message: "success", data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPostsByFollowing(req, res, next) {
    try {
      let pageNumber = parseInt(req.query.pageNumber);
      let pageSize = parseInt(req.query.pageSize);
      let followingList = await User.findOne({
        userId: parseInt(req.params.userId),
      });
      let userIds = [...followingList.following, parseInt(req.params.userId)];
      let posts = await Post.find({ userId: { $in: userIds } })
        .populate({
          path: "virtualUser",
          select: "userId userName profileImage",
        })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
      res.status(200).json({ data: posts, currentPage: pageNumber });
    } catch (error) {
      next(error);
    }
  }
  static async acceptRequest(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const { userId, requestId } = req.body;
      const findRequest = await User.findOne(
        {
          $and: [
            { userId },
            {
              currentFollowRequest: {
                $elemMatch: { requestId, status: "inProgress" },
              },
            },
          ],
        },
        {
          currentFollowRequest: { $elemMatch: { requestId } },
        }
      );
      if (!findRequest) {
        res
          .status(400)
          .json({ message: "request not found or already accepted" });
        return;
      }
      let targetId = findRequest.currentFollowRequest[0].targetId;
      const acceptRequest = await User.findOneAndUpdate(
        {
          $and: [
            { userId },
            { currentFollowRequest: { $elemMatch: { requestId } } },
          ],
        },
        {
          $set: { "currentFollowRequest.$.status": "accepted" },
          $push: { followers: targetId },
        },
        { new: true, session }
      );
      await User.findOneAndUpdate(
        {
          $and: [
            { targetId },
            { requestInProgress: { $elemMatch: { referenceId: requestId } } },
          ],
        },
        { $set: { "requestInProgress.$.status": "accepted" } },
        { new: true, session }
      );

      await User.findOneAndUpdate(
        { userId: targetId },
        { $addToSet: { following: userId } },
        { new: true, session }
      );
      await session.commitTransaction();
      res
        .status(200)
        .json({ message: "request accepted", data: acceptRequest });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }

  static async rejectRequest(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const { userId, requestId } = req.body;
      const findRequest = await User.findOne(
        {
          $and: [
            { userId },
            {
              currentFollowRequest: {
                $elemMatch: { requestId, status: "inProgress" },
              },
            },
          ],
        },
        {
          currentFollowRequest: { $elemMatch: { requestId } },
        }
      );
      if (!findRequest) {
        res
          .status(400)
          .json({ message: "request not found or already rejected" });
        return;
      }
      const rejectRequest = await User.findOneAndUpdate(
        {
          $and: [
            { userId },
            { currentFollowRequest: { $elemMatch: { requestId } } },
          ],
        },
        { $set: { "currentFollowRequest.$.status": "rejected" } },
        { new: true, session }
      );
      let targetId = findRequest.currentFollowRequest[0].targetId;
      await User.findOneAndUpdate(
        {
          $and: [
            { targetId },
            { requestInProgress: { $elemMatch: { referenceId: requestId } } },
          ],
        },
        { $set: { "requestInProgress.$.status": "rejected" } },
        { new: true, session }
      );
      await session.commitTransaction();
      res
        .status(200)
        .json({ message: "request rejected", data: rejectRequest });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }
  static async getCurrentFollowRequest(req, res, next) {
    try {
      const requests = await User.findOne(
        { userId: parseInt(req.params.userId) },
        { currentFollowRequest: 1 }
      ).populate({
        path: "virtualRequestUser",
        select: "userId userName profileImage fullName",
        options: { sort: { updatedAt: -1 } },
      });
      const inProgressRequests = requests.currentFollowRequest.filter(
        (data) => data.status === "inProgress"
      );
      res.status(200).json({ data: [{
        currentFollowRequest: inProgressRequests,
        virtualRequestUser: requests.virtualRequestUser,
      }] });
    } catch (error) {
      next(error);
    }
  }
  static async getCurrentRequestInProgress(req, res, next) {
    try {
      const requests = await User.findOne(
        { userId: parseInt(req.params.userId) },
        { requestInProgress: { $elemMatch: { status: "inProgress" } } }
      );
      res.status(200).json({ data: requests });
    } catch (error) {
      next(error);
    }
  }
  static async getAllFollowings(req, res, next) {
    try {
      const userFollowing = await User.find(
        {
          userId: parseInt(req.params.userId),
        },
        { userId: 1, profileImage: 1, userName: 1, following: 1 }
      ).populate("virtualFollowing", "userId profileImage userName fullName");
      if (userFollowing.length < 0) {
        return res.status(404).json({ message: "no users found" });
      }
      res.status(200).json({ data: userFollowing });
    } catch (error) {
      next(error);
    }
  }

  static async getAllFollowers(req, res, next) {
    try {
      const userFollower = await User.find(
        {
          userId: parseInt(req.params.userId),
        },
        { userId: 1, profileImage: 1, userName: 1, followers: 1 }
      ).populate("virtualFollower", "userId profileImage userName fullName");
      if (userFollower.length < 0) {
        return res.status(404).json({ message: "no users found" });
      }
      res.status(200).json({ data: userFollower });
    } catch (error) {
      next(error);
    }
  }
  static async getUserByUserName(req, res, next) {
    try {
      const userName = req.params.userName;
      const users = await User.find(
        {
          userName,
        },
        {
          password: 0,
          userId: 0,
          _id: 0,
          accountId: 0,
          savedPosts: 0,
          taggedPosts: 0,
          following: 0,
          followers: 0,
          currentFollowRequest: 0,
          requestInProgress: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );
      res.status(200).json({ data: users });
    } catch (error) {
      next(error);
    }
  }

  static async unfollowUser(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const { targetId, userId } = req.body;
      if (
        typeof targetId !== "number" ||
        (targetId <= 0 && typeof userId !== "number") ||
        userId <= 0
      ) {
        return res
          .status(400)
          .json({
            message: "targetId or userId should be in positive integer format",
          });
      }
      const removefollower = await User.findOneAndUpdate(
        { userId: targetId },
        { $pullAll: { followers: [userId] } },
        { new: true, session }
      );
      const removeFollowing = await User.findOneAndUpdate(
        { userId: userId },
        { $pullAll: { following: [targetId] } },
        { new: true, session }
      );
      await session.commitTransaction();
      res.status(200).json({
        status: "follow",
        message: "unfollowed user successfully",
        removeFollowing,
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }
}

const getIncrementedId = async (id) => {
  const counter = await User.findOne(
    { userId: id },
    { currentFollowRequest: 1 }
  );
  return counter.currentFollowRequest.length === 0
    ? 0
    : counter.currentFollowRequest.length;
};
module.exports = UserDomain;
