const USER_STATUS = {
  USER_EXIST: 'username or email is already exists',
  USER_FOUND: 'User found',
  USER_NOTFOUND: 'User not found',
  USER_UPDATE: 'User updated successfully',
  USER_UPDATE_FAILED: 'User updated failed',
  USER_DELETE: 'User disable successfully',
  USER_DELETE_FAILED: 'User disable failed',
  USER_CREATED: 'Register successfully, please check your email for confirmation',
  PERMISSION: 'You do not have permission to access this!',
  AUTHENTICATION_FAIL: 'Wrong username or password',
  AUTHENTICATION: 'Login success',
  UNAUTHENTICATED: 'unauthenticated',
};
const ROLE_DEFINE = {
  ADMIN: 1,
  USER: 2,
  LECTURER: 3,
};
const COMMON_CONSTANTS = {
  TRANSACTION_ERROR: 'Transaction got error !',
  INVALID_PAGE: 'Invalid paging index',
  EMP_ID_NUM_LONG: 6,
  START_EMP_ID: 'ID000000',
  URL_NOT_FOUND: 'URL not found !',
};
const EMAIL_CONSTANTS = {
  EMAIL_CONFIRMATION:
    'A verification email has been sent to your registered email address. It will be expire after one day. If you not get verification Email click on resend token.',
  EMAIL_ERROR: 'Technical Issue!, Please click on resend for verify your Email.',
};
const COURSE_CONSTANTS = {
  COURSE_EXIST: 'Course already exists',
  COURSE_UPDATE_FAILED: 'Course update failed',
  COURSE_DELETE_FAILED: 'Course delete failed',
  COURSE_NOTFOUND: 'Course not found',
};
const LESSON_CONSTANT = {
  LESSON_EXIST: 'Lesson already exists',
  LESSON_NOTFOUND: 'Lesson not found',
  DELETE_SUCCESS: 'Lesson deleted successfully',
  UPDATE_SUCCESS: 'Lesson updated successfully',
  UPDATE_FAILED: 'Lesson update failed',
};
const SECTION_CONSTANT = {
  NOT_FOUND: 'Section not found',
  EXIST: 'Section Exist',
};
export {
  USER_STATUS,
  ROLE_DEFINE,
  COMMON_CONSTANTS,
  EMAIL_CONSTANTS,
  COURSE_CONSTANTS,
  LESSON_CONSTANT,
  SECTION_CONSTANT,
};
