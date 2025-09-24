import { Router } from "express";


const router = Router();
router.get("/health", (_req, res) => {
res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
});
export default router;