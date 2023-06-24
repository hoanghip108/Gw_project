const FORM_STATUS = {
  CLOSE: "close",
  OPEN: "open",
};
const FORM_CATEGORY = {
  PROBATIONARY: 1,
  ANNUAL: 2,
};

const USER_FORM_STATUS = {
  NEW: "new",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  APPROVED_FAILED: "Can not approve form with status is new",
  CLOSED: "closed",
  OVER_DUEDATE: "date is over due",
  USER_FORM_UPDATE: "updated successfully",
  USER_FORM_UPDATE_FAILED: "update failed",
  UPDATE_OTHER_FORM_ERROR: "you cannot modify form of another user",
};
const FORM_MESSAGE = {
  EXIST: "form already exists",
  USER_EXIST: "user already exists",
  CREATED: "Created successfully",
  NOT_FOUND: "Form not found",
  FOUND: "found",
  UPDATE_FAILED: "update failed",
  FORM_CREATED: "Form created successfully",
  FORM_DELETED: "Form deleted successfully",
  FORM_UPDATED: "Form updated successfully",
  FORM_CREATED_FAIL: "Form created fail",
  FORM_UPDATED_FAIL: "Form updated fail",
  FORM_CLOSED_FAIL: "Form closed fail",
  FORM_CLOSED: "Form closed successfully",
  SINGLE_OPEN_FORM_LIMITATION: "Each user only has 1 type of form haven't closed",
  ROLLBACK_FAILED: "data was rollback successfully",
  INVALID_INDEX: "Invalid index",
};
const USER_STATUS = {
  USER_EXIST: "username or email is already exists",
  USER_FOUND: "User found",
  USER_NOTFOUND: "User not found",
  USER_UPDATE: "User updated successfully",
  USER_UPDATE_FAILED: "User updated failed",
  USER_DELETE: "User disable successfully",
  USER_DELETE_FAILED: "User disable failed",
  USER_CREATED: "Created successfully",
  PERMISSION: "You do not have permission to access this!",
  AUTHENTICATION_FAIL: "Wrong username or password",
  AUTHENTICATION: "Login success",
  UNAUTHENTICATED: "unauthenticated",
};
export { FORM_CATEGORY, FORM_STATUS, USER_FORM_STATUS, FORM_MESSAGE, USER_STATUS };
