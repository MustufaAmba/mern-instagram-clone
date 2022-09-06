const Chat = require("../model/chat.model");
const { chatValidate } = require("../validations/chat.validations");
const { getIncrementedId } = require("../commonFunctions");
const connection = require("../connection");
class ChatDomain {
  static async createChat(req, res, next) {
    try {
      const { error } = chatValidate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const { userIds, userId, isGroup } = req.body;
      const chatExists = await Chat.findOne({
        userIds: { $size: req.body.userIds.length, $all: req.body.userIds },
      });
      if (!chatExists) {
        let counter = await getIncrementedId(Chat, "chatId");
        const chatData = {
          chatId: ++counter,
          chatCreatedUserId: userId,
          userIds,
          isGroup,
          lastMessage: null,
        };
        const createChat = await Chat.create(chatData);
        const sendChat = await Chat.findOne({ chatId: createChat.chatId })
          // .populate('lastMessageVirtual','content')
          .populate("groupMembersVirtual", "userId userName profileImage");
        res
          .status(200)
          .json({ message: "chat created successfully", data: [sendChat] });

        return;
      }
      res.status(200).json({ message: "chat already exists", data: [] });
    } catch (error) {
      next(error);
    }
  }
  static async fetchChats(req, res, next) {
    try {
      const allChats = await Chat.find({
        $and: [{ userIds: parseInt(req.params.userId) }, { isActive: true }],
      })
        // .populate('lastMessageVirtual','content')
        .populate("groupMembersVirtual", "userName profileImage")
        .populate("lastMessageVirtual")
        .sort({ updateAt: -1 });
      if (allChats.length !== 0) {
        return res.status(200).json({ data: allChats });
      }
      return res
        .status(200)
        .json({ message: "no chats found please start a new chat", data: [] });
    } catch (error) {
      next(error);
    }
  }
  static async deleteChat(req, res, next) {
    try {
      const { userId } = req.body;
      const isChatExists = await Chat.findOne({
        chatId: parseInt(req.params.chatId),
      });
      if (!isChatExists) {
        return res.status(400).json({ message: "no chat found to delete" });
      }
      let deletedChat={}
      if (isChatExists.userIds.length <= 1) {
        deletedChat=  await Chat.findOneAndUpdate(
          { chatId: parseInt(req.params.chatId) },
          { isActive: false, $pullAll: { userIds: [userId] } }
        );
      }
      else{
        deletedChat= await Chat.findOneAndUpdate(
        { chatId: parseInt(req.params.chatId) },
        { $pullAll: { userIds: [userId] } },
        { new: true }
      );}
      res
        .status(200)
        .json({ message: "chat deleted successfully" ,data:deletedChat});
    } catch (error) {
      next(error);
    }
  }
  static async fetchChatById(req, res, next) {
    try {
      const chat = await Chat.findOne({
        chatId: parseInt(req.params.chatId),
      }).populate("groupMembersVirtual", "userId userName profileImage");
      res.status(200).json({ data: chat });
    } catch (error) {
      next(error);
    }
  }
  static async editChat(req, res, next) {
    try {
      const { error } = chatValidate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const editChat = await Chat.findOneAndUpdate(
        { chatId: parseInt(req.params.chatId) },
        { ...req.body },
        { new: true }
      ).populate("groupMembersVirtual", "userId userName profileImage");
      res
        .status(200)
        .json({ message: "chat edited successfully", data: editChat });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = ChatDomain;
