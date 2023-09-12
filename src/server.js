// Import necessary modules
const sequelizeConfig = require('../.sequelizerc');
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
  console.log('Init - Register services.');
  app.use('/api', routers);
  console.log(`Init - Register services successfully.`);
  return;
};
const initSequelize = () => {
  console.log('Init - Establish connection.');
  return db
    .connect()
    .then(() => {
      console.log('Init - Establish connection successfully.');
      return true;
    })
    .catch((err) => {
      console.log('Init - Establish connection fail:', err);
      return false;
    });
};
const startServer = async () => {
  const path = sequelizeConfig['migrations-path'];

  const server = app.listen(config.port, config.host);
  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  initSequelize();
  initService();
  console.log(
    `Listening on host ${config.host} on port ${config.port} http://${config.host}:${config.port}`,
  );
  const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3000',
      // origin: 'http://www.eschoolhub.click',
      // credentials: true,
    },
  });
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

startServer();
export default app;
