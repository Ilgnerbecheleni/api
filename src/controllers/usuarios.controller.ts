import type { Request, Response, NextFunction } from "express";
import { usuariosService } from "../services/usuarios.service";


export const usuariosController = {
    async list(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await usuariosService.list();
            res.json(data);
        } catch (e) { next(e); }
    },
    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const usuario = await usuariosService.get(id);
            if (!usuario) return res.status(404).json({ error: { message: "Usuário não encontrado" } });
            res.json(usuario);
        } catch (e) { next(e); }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { nome, email, senha } = req.body ?? {};
            const created = await usuariosService.create(nome, email, senha);
            // por segurança, não devolver hash de senha
            const { passwordHash, ...rest } = created as any;
            res.status(201).json(rest);
        } catch (e) { next(e); }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            const { nome, email, senha, verificado } = req.body ?? {};
            const updated = await usuariosService.update(id, { nome, email, senha, verificado });
            const { passwordHash, ...rest } = updated as any;
            res.json(rest);
        } catch (e) { next(e); }
    },
    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            await usuariosService.remove(id);
            res.status(204).send();
        } catch (e) { next(e); }
    },
};