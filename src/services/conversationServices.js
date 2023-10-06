const { sequelize } = require('../config/database');
import { Op } from 'sequelize';
import { USER_STATUS } from '../data/constant';
const Conversation = require('../database/models/conversation');
const User = require('../database/models/user');
const Participant = require('../database/models/participant');
const Message = require('../database/models/message');
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
      const messages = await Message.findAll({
        where: { conversationId: conversation[0].conversationId },
        order: [['createdAt', 'ASC']],
      });

      return [messages, ...conversation];
    } else {
      const receiver = await User.findOne({
        where: { [Op.and]: [{ id: receiverId }, { isDeleted: false }] },
      });
      if (receiver) {
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

        return newConversation;
      }
      return USER_STATUS.USER_NOTFOUND;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export { getConversation, getAllConversations };
