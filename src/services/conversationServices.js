const { sequelize } = require('../config/database');
import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';

const Conversation = require('../database/models/conversation');
const Participant = require('../database/models/participant');
const APIError = require('../helper/apiError');
import httpStatus from 'http-status';
const getAllConversations = async (userId) => {
  const conversation = await Participant.findAll({ where: { userId: userId } });
  return conversation;
};
const getConversation = async (senderId, receiverId) => {
  try {
    const query =
      'SELECT p1.conversationId' +
      ' FROM Participant p1' +
      ' JOIN Participant p2 ON p1.conversationId = p2.conversationId' +
      ' JOIN conversation ON p1.conversationId = conversation.conversationId' +
      ' WHERE p1.userId = :senderId AND p2.userId = :receiverId';
    const replacements = { senderId: senderId, receiverId: receiverId };
    const conversation = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
    });

    if (conversation[0] != null) {
      console.log('One-on-one conversation exists. Conversation ID:', conversation);
      return conversation;
    } else {
      const newConversation = await Conversation.create({
        title: 'One-on-One Conversation',
        createdBy: senderId,
        creatorId: senderId,
      });
      await Participant.bulkCreate([
        {
          userId: senderId,
          conversationId: newConversation.conversationId,
          createdBy: senderId,
        },
        {
          userId: receiverId,
          conversationId: newConversation.conversationId,
          createdBy: senderId,
        },
      ]);
      console.log('Generated new conversation. Conversation ID:', newConversation.conversationId);
      return newConversation;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export { getConversation, getAllConversations };
