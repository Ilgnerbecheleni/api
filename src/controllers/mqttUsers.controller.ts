import type { Request, Response, NextFunction } from "express";
import { mqttUsersService } from "../services/mqttUsers.service";

/**
 * OBS:
 * - Todas as rotas usam allowSelf("id") OU authorizeAdmin().
 * - Não aceitamos userId no body; o :id da rota é a fonte da verdade.
 * - Expondo username/password conforme solicitado.
 */

export const mqttUsersController = {
  // POST /users/:id/mqtt-credentials
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const created = await mqttUsersService.createForUser(userId);
      res.status(201).json(created);
    } catch (e) { next(e); }
  },

  // GET /users/:id/mqtt-credentials
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const data = await mqttUsersService.getForUser(userId);
      res.json(data);
    } catch (e) { next(e); }
  },

  // PATCH /users/:id/mqtt-credentials/regen
  async regenerate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const data = await mqttUsersService.regenerateForUser(userId);
      res.json(data);
    } catch (e) { next(e); }
  },

  // DELETE /users/:id/mqtt-credentials
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const data = await mqttUsersService.removeForUser(userId);
      res.json(data);
    } catch (e) { next(e); }
  },

  // GET /admin/mqtt-users
  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, perPage, q } = req.query ?? {};
      const data = await mqttUsersService.adminList({
        page: page ? Number(page) : undefined,
        perPage: perPage ? Number(perPage) : undefined,
        q: q ? String(q) : undefined,
      });
      res.json(data);
    } catch (e) { next(e); }
  },
};
