import type { Request, Response, NextFunction } from "express";
import { usuariosRepo } from "../repositories/usuarios.repo";

declare global {
  namespace Express {
    interface Request {
      currentUser?: Omit<import("@prisma/client").Usuario, "passwordHash">;
    }
  }
}

export async function requireVerified(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ error: { message: "não autenticado" } });
    }

    const user = await usuariosRepo.get(userId);
    if (!user) {
      return res.status(404).json({ error: { message: "usuário não encontrado" } });
    }

    if (!user.verificado) {
      return res.status(403).json({
        error: {
          message: "sua conta ainda não foi verificada. Verifique seu e-mail.",
          action: {
            hint: "reenvie o e-mail de verificação",
            endpoint: "/auth/request-verify",
            method: "POST",
            body: { email: user.email }
          }
        }
      });
    }

    // anexa user sem hash para uso na rota
    const { passwordHash, ...publicUser } = user as any;
    req.currentUser = publicUser;
    next();
  } catch (e) {
    next(e);
  }
}
