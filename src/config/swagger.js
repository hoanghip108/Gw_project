const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
    },
  },
  apis: ["../routes*.js"], // Path to the API routes in your project
};

const specs = swaggerJsdoc(options);

module.exports = specs;
