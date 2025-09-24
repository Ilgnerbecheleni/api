// src/controllers/posts.controller.ts
import type { Request, Response, NextFunction } from "express";
import { postsService } from "../services/posts.service";

// Tipos para melhor DX
type IdParam = { id: string };

type CreateBody = {
  titulo: string;
  conteudo: string;
  data?: string; // ISO opcional
};

type UpdateBody = Partial<CreateBody>;

export const postsController = {
  async create(
    req: Request<unknown, unknown, CreateBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authorId = req.user!.sub; // já tipado pelo augment
      const { titulo, conteudo, data } = req.body ?? {};
      const created = await postsService.create(authorId, titulo, conteudo, data);
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  },

  async listMine(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authorId = req.user!.sub;
      const items = await postsService.listMine(authorId);
      res.json(items);
    } catch (e) {
      next(e);
    }
  },

  // autor vê seu post; admin vê qualquer
  async get(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requesterId = req.user!.sub;
      const id = Number(req.params.id);
      const post = await postsService.getById(requesterId, id);
      res.json(post);
    } catch (e) {
      next(e);
    }
  },

  // autor edita o seu; admin edita qualquer
  async update(
    req: Request<IdParam, unknown, UpdateBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requesterId = req.user!.sub;
      const id = Number(req.params.id);
      const { titulo, conteudo, data } = req.body ?? {};
      const updated = await postsService.update(requesterId, id, { titulo, conteudo, data });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  },

  // autor remove o seu; admin remove qualquer
  async remove(
    req: Request<IdParam>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requesterId = req.user!.sub;
      const id = Number(req.params.id);
      await postsService.remove(requesterId, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};
