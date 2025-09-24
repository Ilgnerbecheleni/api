import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";


export const authController = {
async login(req: Request, res: Response, next: NextFunction) {
try {
const { email, senha } = req.body ?? {};
const result = await authService.login(email, senha);
res.json(result);
} catch (e) { next(e); }
},


async register(req: Request, res: Response, next: NextFunction) {
try {
const { nome, email, senha } = req.body ?? {};
const result = await authService.register(nome, email, senha);
// result.mode: "created" | "resent"
const status = result.mode === "created" ? 201 : 202;
res.status(status).json({ message: result.message, user: result.user });
} catch (e) { next(e); }
},
};