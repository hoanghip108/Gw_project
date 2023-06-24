const BaseModel = require("../base");
module.exports = class User extends BaseModel {
  static tableName = "user";
  static modelName = "user";
  static schema = require("./schema");
  static include = [];
  static associate(models) {}
};
