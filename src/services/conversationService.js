const { sequelize } = require('../config/database');
import { COURSE_CONSTANTS, COMMON_CONSTANTS } from '../data/constant';

const Conversation = require('../database/models/conversation');
const Participant = require('../database/models/participant');
const APIError = require('../helper/apiError');
import httpStatus from 'http-status';

const createConversation = async (senderId, receiverId) => {
  let t;
  try {
    t = await sequelize.transaction();
    const conversation = await Conversation.findOne({
      include: [{ model: Participant, where: { userId: [senderId, receiverId] } }],
      having: sequelize.literal(`COUNT("participant"."id") = 2`),
      group: 'Conversation.id',
    });
    return conversation !== null;
  } catch (err) {
    await t.rollback();
    throw new APIError({
      message: COMMON_CONSTANTS.TRANSACTION_ERROR,
      status: httpStatus.NOT_FOUND,
    });
  }
};
export { createConversation };
