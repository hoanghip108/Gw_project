const userRouter = require('./userRoutes');
const videoRouter = require('./videoRoutes');
const courseRouter = require('./courseRoutes');
const conversationRouter = require('./conversationRoutes');
const messageRouter = require('./messageRoutes');
const paymentRouter = require('./paymentRoutes');
const subCategoryRouter = require('./subCategoryRoutes');
const { lastIndexOf } = require('lodash');
const lessonRouter = require('./lessonRoutes');
const sectionRouter = require('./sectionRoutes');
const categoryRouter = require('./categoryRoutes');
const quizRouter = require('./quizRoutes');
const questionRouter = require('./questionRoutes');
const express = require('express');
const routers = express.Router();
routers.use(userRouter);
routers.use(videoRouter);
routers.use(courseRouter);
routers.use(lessonRouter);
routers.use(conversationRouter);
routers.use(messageRouter);
routers.use(paymentRouter);
routers.use(sectionRouter);
routers.use(categoryRouter);
routers.use(subCategoryRouter);
routers.use(quizRouter);
routers.use(questionRouter);
const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'routes');
const getRoutePatchs = async () => {
  const routePathsSet = new Set();
  try {
    const files = await fs.promises.readdir(routesPath);
    const jsFiles = files.filter((file) => path.extname(file) === '.js' && file !== 'index.js');

    const arr = jsFiles.map((file) => file.split('s.')[0] + 'r');
    for (let i = 0; i < arr.length; i++) {
      let router = require(`./${arr[i].substring(0, lastIndexOf(arr[i], 'r')) + 's.js'}`);
      router.stack.forEach((route) => {
        console.log(route.route.path);
        routePathsSet.add(route.route.path);
      });
    }

    return Array.from(routePathsSet); // Convert the Set to an array
  } catch (err) {
    console.error('Error reading routes directory:', err);
    return [];
  }
};
export { routers, getRoutePatchs };
