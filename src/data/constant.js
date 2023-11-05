const USER_STATUS = {
  USER_EXIST: 'username is already exists',
  USER_FOUND: 'User found',
  USER_NOTFOUND: 'User not found',
  USER_UPDATE: 'User updated successfully',
  USER_UPDATE_FAILED: 'User updated failed',
  USER_DELETE: 'User disable successfully',
  USER_DELETE_FAILED: 'User disable failed',
  USER_CREATED: 'Register successfully, please check your email for confirmation',
  SELF_DELETE: 'You can not delete yourself',
  NSF: 'Not sufficient funds',
  BILL_PAID: 'Bill paid successfully',
  UPDATE_ROLE_FAIL: 'Update role failed',
  UPDATE_ROLE_SUCCESS: 'request role has been approved successfully',
  ROLE_NOTFOUND: 'Role not found',
  REQUEST_CHANGE_ROLE: 'Request change role send successfully',
  REQUEST_CHANGE_ROLE_FAIL: 'Request change role failed',
  USER_ROLE_EXIST: 'Account already has this role',
  USER_REQUEST_ROLE_EXIST: 'Account already has a pending request to change role',
  USER_ROLE_REQUEST_NOTFOUND: 'request to change role on this account is not found',
  FRIEND_EXIST: 'Already friend ',
  EMAIL_EXIST: 'Email already exists',
  FRIEND_REQUEST_DOES_NOT_EXIST: 'Friend request does not exist',
  FRIEND_REQUEST_EXIST: 'Friend request already exists',
};
const AUTH_CONSTANT = {
  PERMISSION: 'You do not have permission to access this!',
  AUTHENTICATION_FAIL: 'Wrong username or password',
  AUTHENTICATION: 'Login success',
  UNAUTHENTICATED: 'unauthenticated',
  TOKEN_EXPIRED: 'token expired',
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
  EXIST: 'data exists',
  PENDING: 'pending',
  APPROVED: 'accepted',
  REJECTED: 'rejected',
  SUCCESS: 'success',
  SEND_REQUEST_TO_YOURSELF: 'You can not send request to yourself',
  NOT_FOUND: 'data not found',
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
  APPROVED: 'Course approved successfully',
};
const LESSON_CONSTANT = {
  LESSON_EXIST: 'Lesson already exists',
  LESSON_NOTFOUND: 'Lesson not found',
  DELETE_SUCCESS: 'Lesson deleted successfully',
  UPDATE_SUCCESS: 'Lesson updated successfully',
  UPDATE_FAILED: 'Lesson update failed',
};
const SECTION_CONSTANT = {
  CREATED: 'Section created successfully',
  UPDATED: 'Section updated successfully',
  FOUND: 'Section found',
  NOT_FOUND: 'Section not found',
  EXIST: 'Section Exist',
};
const CATEGORY_CONSTANTS = {
  CREATED: 'Category created successfully',
  CATEGORY_EXIST: 'Category already exists',
  CATEGORY_NOTFOUND: 'Category not found',
  UPDATED: 'Category updated successfully',
  DELETED: 'Category deleted successfully',
};
const SUBCATEGORY_CONSTANTS = {
  CREATED: 'sub-Category created successfully',
  SUBCATEGORY_EXIST: 'sub-Category already exists',
  SUBCATEGORY_NOTFOUND: 'sub-Category not found',
  UPDATED: 'sub-Category updated successfully',
  DELETED: 'sub-Category deleted successfully',
};
const QUIZ_CONSTANTS = {
  CREATED: 'Quiz created successfully',
  UPDATED: 'Quiz updated successfully',
  DELETED: 'Quiz deleted successfully',
  NOT_FOUND: 'Quiz not found',
  INVALID_AUTHOR: "You don't have permission to create or update quiz in this course",
};
const QUESTION_CONSTANTS = {
  CREATED: 'Question created successfully',
  UPDATED: 'Question updated successfully',
  DELETED: 'Question deleted successfully',
  NOT_FOUND: 'Question not found',
  INVALID_AUTHOR: "You don't have permission to create or update question in this course",
};
export {
  USER_STATUS,
  ROLE_DEFINE,
  COMMON_CONSTANTS,
  EMAIL_CONSTANTS,
  COURSE_CONSTANTS,
  LESSON_CONSTANT,
  SECTION_CONSTANT,
  CATEGORY_CONSTANTS,
  SUBCATEGORY_CONSTANTS,
  AUTH_CONSTANT,
  QUIZ_CONSTANTS,
  QUESTION_CONSTANTS,
};
