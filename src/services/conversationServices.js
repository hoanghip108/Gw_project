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
    const query = `SELECT p1.conversationId FROM participant p1 JOIN participant p2 ON p1.conversationId = p2.conversationId JOIN conversation ON p1.conversationId = conversation.conversationId WHERE p1.userId = ${senderId} AND p2.userId = ${receiverId}`;
    const conversation = await sequelize.query(query);
    console.log('this is conversation', conversation);
    if (conversation[0].length > 0) {
      console.log('this is conversation id', conversation[0][0].conversationId);
      const messages = await Message.findAll({
        where: { conversationId: conversation[0][0].conversationId },
        order: [['createdAt', 'ASC']],
      });

      return messages;
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
