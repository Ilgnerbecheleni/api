import express from "express";


const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(express.json());


app.get("/health", (_req, res) => {
res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
});


app.get("/hello", (req, res) => {
const name = (req.query.name as string) || "mundo";
res.json({ message: `Olá, ${name}!` });
});


app.listen(PORT, () => {
console.log(`✅ API rodando em http://localhost:${PORT}`);
});