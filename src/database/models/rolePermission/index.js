const BaseModel = require('../base');
const Role = require('../role');
const Permission = require('../permission');

module.exports = class rolePermission extends BaseModel {
  static modelName = 'rolePermission';
  static tableName = 'rolePermissions';
  static schema = require('./schema');
  static associate(models) {
    this.belongsTo(models.Role);
    this.belongsTo(models.Permission);
  }
};
