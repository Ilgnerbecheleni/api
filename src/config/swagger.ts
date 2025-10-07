import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";

const options: OAS3Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API — codteech",
      version: "1.0.0",
      description:
        "API Express + TypeScript com Auth JWT, Verificação por e-mail, RBAC e Posts.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Dev" },
      // { url: "https://api.codteech.com.br", description: "Prod" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: { type: "string", format: "email" },
            senha: { type: "string", minLength: 6 },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer" },
                nome: { type: "string" },
                email: { type: "string" },
                verificado: { type: "boolean" },
                role: { type: "string", enum: ["USER", "ADMIN"] },
              },
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: { type: "integer" },
            titulo: { type: "string" },
            conteudo: { type: "string" },
            data: { type: "string", format: "date-time" },
            authorId: { type: "integer" },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["titulo", "conteudo"],
          properties: {
            titulo: { type: "string" },
            conteudo: { type: "string" },
            data: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }], // segurança global (JWT)
  },
  // arquivos com anotações JSDoc
  apis: [
    "src/routes/**/*.ts",
    "src/controllers/**/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
