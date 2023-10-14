const Question = require('../database/models/question');
const Quiz = require('../database/models/quiz');
const Answer = require('../database/models/answer');
const { sequelize } = require('../config/database');
import ExcludedData from '../helper/excludeData';
const dataToExclude = [...Object.values(ExcludedData)];
import { QUIZ_CONSTANTS, QUESTION_CONSTANTS } from '../data/constant';
const createQuestion = async (currentUser, data) => {
  const quiz = await Quiz.findOne({ where: { quizId: data.quizId } });
  if (!quiz) {
    return QUIZ_CONSTANTS.NOT_FOUND;
  } else {
    const author = await sequelize.query(
      `SELECT course.createdBy FROM course JOIN section ON section.courseId = course.courseId JOIN quiz ON quiz.sectionId = section.sectionId WHERE quizId = ${data.quizId}`,
    );
    if (currentUser !== author[0][0].createdBy) {
      return QUESTION_CONSTANTS.INVALID_AUTHOR;
    } else {
      let questions = data.questions;
      for (let i = 0; i < questions.length; i++) {
        const newQuestion = await Question.create({
          content: questions[i].content,
          createdBy: currentUser,
          quizId: data.quizId,
        });
        if (!newQuestion) {
          return QUESTION_CONSTANTS.CREATED_FAILED;
        }
        let answers = questions[i].answer;
        for (let j = 0; j < answers.length; j++) {
          const newAnswer = await Answer.create({
            content: answers[j].content,
            isCorrect: answers[j].isCorrect,
            questionId: newQuestion.questionId,
            createdBy: currentUser,
          });
          if (!newAnswer) {
            return QUESTION_CONSTANTS.CREATED_FAILED;
          }
        }
      }
    }
  }
};
const updateQuestion = async (currentUser, data) => {};
export { createQuestion };
