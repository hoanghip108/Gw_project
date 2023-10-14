const Quiz = require('../database/models/quiz');
const Course = require('../database/models/course');
const Question = require('../database/models/question');
const Answer = require('../database/models/answer');
const { sequelize } = require('../config/database');
import ExcludedData from '../helper/excludeData';
import { COMMON_CONSTANTS, QUIZ_CONSTANTS } from '../data/constant';
import httpStatus from 'http-status';
const dataToExclude = [...Object.values(ExcludedData)];
const getListQuiz = async (pageIndex, pageSize) => {
  let offset = (pageIndex - 1) * pageSize;
  let limit = pageSize;
  const quizzes = await Quiz.findAll({
    where: { isDeleted: false },
    offset,
    limit,
    include: [
      {
        model: Question,
        include: [{ model: Answer, attributes: { exclude: dataToExclude } }],
        attributes: { exclude: dataToExclude },
      },
    ],
    attributes: { exclude: dataToExclude },
  });
  const totalCount = await Quiz.count({ where: { isDeleted: false } }, { offset, limit });
  if (!totalCount) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  }
  const totalPages = Math.ceil(totalCount / pageSize);
  if (pageIndex > totalPages) {
    return COMMON_CONSTANTS.INVALID_PAGE;
  }
  return {
    status: httpStatus.OK,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    quizzes,
  };
};
const getQuiz = async (quizId) => {
  const quiz = await Quiz.findOne({
    where: { quizId: quizId, isDeleted: false },
    attributes: { exclude: dataToExclude },
  });
  if (!quiz) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  }
  return quiz;
};
const createQuiz = async (currentUser, payload) => {
  const author = await sequelize.query(
    `SELECT course.createdBy FROM course JOIN section ON section.courseId = course.courseId WHERE sectionId = ${payload.sectionId}`,
  );
  console.log('this is author', author);
  if (currentUser !== author[0][0].createdBy) {
    return QUIZ_CONSTANTS.INVALID_AUTHOR;
  } else {
    console.log('this is payload', payload);
    const newQuiz = await Quiz.create({ ...payload, createdBy: currentUser });
    if (!newQuiz) {
      return QUIZ_CONSTANTS.CREATED_FAILED;
    }
    return newQuiz;
  }
};
const updateQuiz = async (currentUser, quizId, payload) => {
  const author = await sequelize.query(
    `SELECT course.createdBy FROM course JOIN section ON section.courseId = course.courseId JOIN quiz ON quiz.sectionId = section.sectionId WHERE quizId = ${quizId}`,
  );
  if (currentUser !== author[0][0].createdBy) {
    return QUIZ_CONSTANTS.INVALID_AUTHOR;
  } else {
    const quiz = await Quiz.findOne({ where: { quizId: quizId } });
    if (!quiz) {
      return QUIZ_CONSTANTS.NOT_FOUND;
    }
    const updatedQuiz = await quiz.update({ payload, updatedBy: currentUser });
    if (!updatedQuiz) {
      return QUIZ_CONSTANTS.UPDATED_FAILED;
    }
    return updatedQuiz;
  }
};
const deleteQuiz = async (currentUser, quizId) => {
  const author = await sequelize.query(
    `SELECT course.createdBy FROM course JOIN section ON section.courseId = course.courseId JOIN quiz ON quiz.sectionId = section.sectionId WHERE quizId = ${quizId}`,
  );
  if (author[0][0] === undefined) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  }
  if (currentUser !== author[0][0].createdBy) {
    return QUIZ_CONSTANTS.INVALID_AUTHOR;
  } else {
    const quiz = await Quiz.findOne({ where: { quizId: quizId } });
    if (!quiz) {
      return QUIZ_CONSTANTS.NOT_FOUND;
    }
    const questions = await Question.findAll({
      where: { quizId: quizId },
      attributes: ['questionId'],
    });

    for (let i = 0; i < questions.length; i++) {
      await Answer.destroy({ where: { questionId: questions[i].questionId } });
      await Question.destroy({ where: { questionId: questions[i].questionId } });
    }
    const deleted = await quiz.destroy();
    if (!deleted) {
      return QUIZ_CONSTANTS.DELETED_FAILED;
    }
    return QUIZ_CONSTANTS.DELETED;
  }
};
export { getListQuiz, getQuiz, createQuiz, updateQuiz, deleteQuiz };
