import type { Request, Response, NextFunction } from "express";
import { usuariosRepo } from "../repositories/usuarios.repo";


export const adminController = {
    async listUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await usuariosRepo.list();
            const sanitized = users.map((u: any) => {
                const { passwordHash, ...rest } = u;
                return rest;
            });
            res.json(sanitized);
        } catch (e) { next(e); }
    },


    async setRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { role } = req.body ?? {};
            if (role !== "USER" && role !== "ADMIN") {
                return res.status(400).json({ error: { message: "role inválido (USER|ADMIN)" } });
            }
            const updated = await usuariosRepo.update(id, { role });
            const { passwordHash, ...rest } = updated as any;
            res.json(rest);
        } catch (e) { next(e); }
    },
};