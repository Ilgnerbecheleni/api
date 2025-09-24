// src/middlewares/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthPayload {
  sub: number;     // id do usuário
  email: string;   // email
  nome?: string;   // deixe opcional para evitar erro se o token não tiver
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: { message: "token ausente" } });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // jwt.verify pode ser string | JwtPayload → fazemos o narrowing
    if (typeof decoded === "string") {
      return res.status(401).json({ error: { message: "token inválido" } });
    }

    // Agora decoded é JwtPayload. Pegamos os campos com segurança.
    const payload = decoded as JwtPayload & {
      sub?: string | number;
      email?: string;
      nome?: string;
    };

    if (payload.sub == null || payload.email == null) {
      return res.status(401).json({ error: { message: "token inválido" } });
    }

    req.user = {
      sub: typeof payload.sub === "string" ? Number(payload.sub) : payload.sub,
      email: String(payload.email),
      nome: payload.nome, // opcional
    };

    if (!Number.isFinite(req.user.sub)) {
      return res.status(401).json({ error: { message: "token inválido" } });
    }

    next();
  } catch {
    return res.status(401).json({ error: { message: "token inválido" } });
  }
}
