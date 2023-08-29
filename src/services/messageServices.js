const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';
const Conversation = require('../database/models/conversation');
const Participant = require('../database/models/participant');
const Message = require('../database/models/message');
const APIError = require('../helper/apiError');

const sendMessage = async (senderId, conversationId, payload) => {
  const participant = await Participant.findOne({
    where: { [Op.and]: [{ conversationId: conversationId }, { userId: senderId }] },
  });
  if (participant) {
    const message = await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      createdBy: senderId,
      content: payload.content,
      messageType: payload.messageType,
    });
    return message;
  }
  return null;
};
export { sendMessage };
