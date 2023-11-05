const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
const Conversation = require('../database/models/conversation');
const Participant = require('../database/models/participant');
const Message = require('../database/models/message');
const APIError = require('../helper/apiError');

const getMessages = async (senderId, receiverId, conversationId, payload) => {
  const conversation = await sequelize.query(`SELECT p1.conversationId 
  FROM Participant p1
  JOIN Participant p2 ON p1.conversationId = p2.conversationId
  JOIN conversation ON p1.conversationId = conversation.conversationId
  WHERE p1.userId = ${senderId} AND p2.userId = ${receiverId}`);
  if (conversation[0].length > 0) {
    const messages = await Message.findAll({
      where: { conversationId: conversation[0][0].conversationId },
    });
    return messages;
  }
  return null;
};
const sendMessage = async (senderId, receiverId, conversationId, payload) => {
  const participant = await Participant.findOne({
    where: { [Op.and]: [{ conversationId: conversationId }, { userId: senderId }] },
  });
  if (participant) {
    const message = await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      receiverId: receiverId,
      createdBy: senderId,
      content: payload.content,
      messageType: payload.messageType,
    });
    return message;
  }
  return null;
};
export { getMessages, sendMessage };
