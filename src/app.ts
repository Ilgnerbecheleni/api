import express from "express";
import routes from "./routes";
import { errorHandler } from "./middlewares/error";


export function createApp() {
const app = express();
app.use(express.json());


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