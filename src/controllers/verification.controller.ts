import type { Request, Response, NextFunction } from "express";
import { verificationService } from "../services/verification.service";


export const verificationController = {
async request(req: Request, res: Response, next: NextFunction) {
try {
const { email } = req.body ?? {};
await verificationService.requestByEmail(email);
res.status(204).send(); // silencioso para não vazar existência
} catch (e) { next(e); }
},


async verify(req: Request, res: Response, next: NextFunction) {
try {
const token = (req.query.token as string) || "";
await verificationService.verifyByToken(token);
res.json({ message: "E-mail verificado com sucesso." });
} catch (e) { next(e); }
},
};