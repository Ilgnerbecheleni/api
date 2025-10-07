import express from "express";
import cors, { CorsOptions } from "cors";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/error";

export function createApp() {
  const app = express();

  const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
     "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.WEB_ORIGIN || "",
  ].filter(Boolean);

  const corsOptions: CorsOptions = {
    origin(origin, cb) {
      if (!origin) return cb(null, true);               // curl/Postman
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS bloqueado: ${origin}`));
    },
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: false, // true só se usar cookies
    maxAge: 86400,
  };

  // CORS ANTES de tudo:
  app.use(cors(corsOptions));

  app.use(express.json());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

  app.use(routes);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
  });

  app.use(errorHandler);

  return app;
}
