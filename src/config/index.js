const dotenv = require('dotenv');
const path = require('path');
const cleanedEnv = process.env.NODE_ENV.replace(/\s/g, '');
dotenv.config({
  path: path.resolve(__dirname, `${cleanedEnv}.env`),
});
console.log('this is path: ', path.resolve(__dirname, `${cleanedEnv}.env`));
const configs = {
  base: {
    NODE_ENV: process.env.NODE_ENV,
    // Application
    name: process.env.APP_NAME,
    host: process.env.HTTP_HOST,
    port: process.env.HTTP_PORT,
    // Database
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_dialect: process.env.DB_DIALECT,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_database: process.env.DB_DATABASE,
    db_run_migration: process.env.DB_RUN_MIGRATION != 'false', // True as default
    // db_recreate: process.env.DB_RECREATE == 'true',
    db_recreate: true,

    //paginate
    defaultIndexPagination: process.env.DEFAULT_INDEX_PAGINATION || 1,
    defaultSizePagination: process.env.DEFAULT_SIZE_PAGINATION || 10,
    //seed data
    // seeders: {
    //     path: '../seeders'
    //   }
  },
};
const config = Object.assign(configs.base);

module.exports = config;
