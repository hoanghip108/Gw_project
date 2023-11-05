import express from 'express';
import config from './config/index.js';
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./src/config/swagger.yaml');
import db from './database/index.js';
const cors = require('cors');
const logger = require('./utils/logger');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { routers, getRoutePaths } from './routes';
const initService = () => {
  logger.info('Init - Register services.');
  app.use('/api', routers);
  logger.info(`Init - Register services successfully.`);
  return;
};
const initSequelize = () => {
  logger.info('Init - Establish connection.');
  return db
    .connect()
    .then(() => {
      logger.info('Init - Establish connection successfully.');
      return true;
    })
    .catch((err) => {
      logger.error('Init - Establish connection fail: ', err);
      return false;
    });
};
const startServer = async () => {
  const server = app.listen(config.port, config.host);
  const io = require('socket.io')(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://eschoolhub.click'],
      methods: ['GET', 'POST,', 'PUT', 'DELETE', 'PATCH'],
      credentials: false,
    },
  });
  const socketController = require('./controllers/socketController');
  socketController(io);

  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  initSequelize();
  initService();
  logger.info(
    `Listening on host ${config.host} on port ${config.port} http://${config.host}:${config.port}`,
  );
};
startServer();
// export default app;
module.exports = app;
