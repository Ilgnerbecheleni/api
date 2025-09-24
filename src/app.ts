import express from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares/error";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

export function createApp() {
const app = express();
app.use(express.json());

 // Swagger UI e JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));
// rotas
app.use(routes);


// health em nível de app (opcional)
app.get("/health", (_req, res) => {
res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
});


// erro global
app.use(errorHandler);


return app;
}