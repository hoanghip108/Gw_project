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
const ROLE = {
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
export { USER_STATUS, ROLE, COMMON_CONSTANTS };
