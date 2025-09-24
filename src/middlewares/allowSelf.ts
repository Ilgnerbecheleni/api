import type { Request, Response, NextFunction } from "express";
import { isAdmin } from "../lib/roles";


export function allowSelf(paramName: string = "id") {
return async (req: Request, res: Response, next: NextFunction) => {
const userIdFromToken = req.user?.sub;
const idParam = Number((req.params as any)[paramName]);


if (!userIdFromToken) return res.status(401).json({ error: { message: "não autenticado" } });
if (!Number.isFinite(idParam)) return res.status(400).json({ error: { message: "id inválido" } });


// Admin pode tudo
if (await isAdmin(userIdFromToken)) return next();


if (userIdFromToken !== idParam) return res.status(403).json({ error: { message: "sem permissão" } });
next();
};
}