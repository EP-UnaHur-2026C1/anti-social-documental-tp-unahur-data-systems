const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Anti-Social API",
      version: "1.0.0",
      description: "Documentación de la API del proyecto red social",
    },
    servers: [
      {
        url: "http://localhost:3050",
      },
    ],
  },
  apis: ["./src/docs/openapi.yaml"],
});

module.exports = swaggerSpec;