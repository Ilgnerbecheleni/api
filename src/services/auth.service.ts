// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { usuariosRepo } from "../repositories/usuarios.repo";
import { env } from "../config/env";

export const authService = {
  async login(email: string, senha: string) {
    if (!email?.trim() || !senha) {
      const err = new Error("email e senha são obrigatórios");
      (err as any).status = 400;
      throw err;
    }

    const normalized = email.trim().toLowerCase();
    const user = await usuariosRepo.getByEmail(normalized);
    if (!user) {
      const err = new Error("credenciais inválidas");
      (err as any).status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(senha, user.passwordHash);
    if (!ok) {
      const err = new Error("credenciais inválidas");
      (err as any).status = 401;
      throw err;
    }

    // Tipos explícitos resolvem o overload
    const secret: Secret = env.JWT_SECRET;
    const signOpts: SignOptions = {
      // pode ser "15m", "1h", 900, etc.
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    const token = jwt.sign(
      { sub: user.id, email: user.email, nome: user.nome },
      secret,
      signOpts
    );

    const { passwordHash, ...publicUser } = user as any;
    return { token, user: publicUser };
  },
};
