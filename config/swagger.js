import swaggerIds from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ceylon Makeup API",
      version: "1.0.0",
      description: "API documentation for Ceylon Makeup application",
    },
    servers: [
      {
        url: "/",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerIds(options);

export default specs;
