const httpStatus = require('http-status');

class ExtendableResponse {
  constructor(message, code, data) {
    this.message = message;
    this.code = code;
    if (data) {
      this.data = data;
    }
  }
}

class Common extends ExtendableResponse {
  constructor(message, code, data) {
    super(message || '', code || httpStatus.OK, data);
  }
}

class Success extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Success.', httpStatus.OK, data);
  }
}

class CreatedSuccess extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Data saved successfully.', httpStatus.CREATED, data);
  }
}

class DeletedSuccess extends ExtendableResponse {
  constructor(message) {
    super(message || 'Data deleted successfully.', httpStatus.OK);
  }
}

class BadRequest extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Bad request.', httpStatus.BAD_REQUEST, data);
  }
}

class Unauthorized extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Unauthorized.', httpStatus.UNAUTHORIZED, data);
  }
}
class WrongUsernameOrpassWord extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'wrong username or password.', httpStatus.UNAUTHORIZED, data);
  }
}

class Forbidden extends ExtendableResponse {
  constructor(message) {
    super(message || `Don't have permissions.`, httpStatus.FORBIDDEN);
  }
}

class NotFound extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Data not found.', httpStatus.NOT_FOUND, data);
  }
}

class Conflict extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Data conflict.', httpStatus.CONFLICT, data);
  }
}

class ValidateFailed extends ExtendableResponse {
  constructor(message, data) {
    super(message || 'Data validate failed.', httpStatus.UNPROCESSABLE_ENTITY);
    this.errors = data;
  }
}

module.exports = {
  Common,
  Success,
  CreatedSuccess,
  DeletedSuccess,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  ValidateFailed,
  WrongUsernameOrpassWord,
};
