const path = require('path');
const Umzug = require('umzug');
const { sequelize } = require('../config/database');
const sequelizeConfig = require('../../.sequelizerc');
const logger = require('./logger');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize,
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(), // queryInterface
      sequelize.constructor, // DataTypes
      function () {
        throw new Error(
          'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.',
        );
      },
    ],
    path: sequelizeConfig['migrations-path'],
    pattern: /\.js$/,
  },

  logging: (msg) => {
    logger.info(msg);
  },
});
console.log(umzug.migrations.path);
const logUmzugEvent = (eventName) => {
  return (name, migration) => {
    logger.info(`${name} ${eventName}`);
  };
};

// umzug.on('migrating', logUmzugEvent('migrating'));
// umzug.on('migrated', logUmzugEvent('migrated'));
// umzug.on('reverting', logUmzugEvent('reverting'));
// umzug.on('reverted', logUmzugEvent('reverted'));

const status = () => {
  let result = {};

  return umzug
    .executed()
    .then((executed) => {
      result.executed = executed;
      return umzug.pending();
    })
    .then((pending) => {
      result.pending = pending;
      return result;
    })
    .then(({ executed, pending }) => {
      executed = executed.map((m) => {
        m.name = path.basename(m.file, '.js');
        return m;
      });
      pending = pending.map((m) => {
        m.name = path.basename(m.file, '.js');
        return m;
      });

      const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
      const status = {
        current: current,
        executed: executed.map((m) => m.file),
        pending: pending.map((m) => m.file),
      };

      logger.info(JSON.stringify(status, null, 2));

      return { executed, pending };
    });
};

const migrate = () => {
  return umzug.up();
};

const migrateNext = () => {
  return status().then(({ executed, pending }) => {
    if (pending.length === 0) {
      return Promise.reject(new Error('No pending migrations'));
    }
    const next = pending[0].name;
    return umzug.up({ to: next });
  });
};

const migrateTo = (to) => {
  return umzug.up({ to });
};

const reset = () => {
  return umzug.down({ to: 0 });
};

const resetPrev = () => {
  return status().then(({ executed, pending }) => {
    if (executed.length === 0) {
      return Promise.reject(new Error('Already at initial state'));
    }
    const prev = executed[executed.length - 1].name;
    return umzug.down({ to: prev });
  });
};

const resetTo = (to) => {
  return umzug.down({ to });
};

module.exports = {
  status,
  migrate,
  migrateNext,
  migrateTo,
  reset,
  resetPrev,
  resetTo,
};
