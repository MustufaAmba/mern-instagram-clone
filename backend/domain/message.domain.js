const Message = require("../model/message.model");
const Chat = require("../model/chat.model");
const connection = require("../connection");
const { messageValidate } = require("../validations/chat.validations");
const { getIncrementedId } = require("../commonFunctions");
class MessageDomain {
  static async sendMessage(req, res, next) {
    const session = await connection.startSession();
    try {
      session.startTransaction();
      const { error } = messageValidate(req.body);
      const chatId = parseInt(req.params.chatId);
      if (error) {
        return res
          .status(400)
          .json({ message: "bad request please send in correct format" });
      }
      const { senderId, content } = req.body;
      const isChatExists = await Chat.findOne({ chatId });
      if (!isChatExists) {
        return res
          .status(400)
          .json({ message: "incorrect chat id please select a valid chat" });
      }
      let counter = await getIncrementedId(Message, "messageId");
      const messageData = {
        messageId: ++counter,
        chatId,
        senderId,
        content,
      };
      const newMessage = await Message.create([messageData], { session });
      const sendNewMessage = await Message.populate(newMessage,{path:"senderIdVirtual",select:"userId userName profileImage"})
      await Chat.findOneAndUpdate(
        { chatId },
        { $set: { lastMessage: newMessage[0].messageId } },
        { session, new: true }
      );
      await session.commitTransaction();
      res
        .status(200)
        .json({ message: "message send successfully", data: sendNewMessage });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    }
    session.endSession();
  }
  static async fetchAllMessages(req, res, next) {
    try {
      const isChatExists = await Chat.findOne({
        chatId: parseInt(req.params.chatId),
      });
      if (!isChatExists) {
        return res
          .status(400)
          .json({ message: "incorrect chat id please select a valid chat" });
      }
      const isMessageExists = await Message.find({
        chatId: parseInt(req.params.chatId),
      })
        .populate("senderIdVirtual", "userId userName profileImage")
        .sort({ updatedAt: 1 });
      if (isMessageExists.length > 0) {
        return res.status(200).json({ data: isMessageExists });
      }
      res
        .status(200)
        .json({
          message: "no message found for this chat send your first message",
          data:[]
        });
    } catch (error) {
      next(error);
    }
  }
  
}

module.exports = MessageDomain;
