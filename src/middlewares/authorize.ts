import type { Request, Response, NextFunction } from "express";
import { isAdmin } from "../lib/roles";


export function authorizeAdmin() {
return async (req: Request, res: Response, next: NextFunction) => {
const userId = req.user?.sub;
if (!userId) return res.status(401).json({ error: { message: "não autenticado" } });
if (!(await isAdmin(userId))) return res.status(403).json({ error: { message: "admin requerido" } });
next();
};
}