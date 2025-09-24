import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { usuariosRepo } from "../repositories/usuarios.repo";
import { env } from "../config/env";
import { verificationService } from "./verification.service";

const SALT_ROUNDS = 10;

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

    const secret: Secret = env.JWT_SECRET;
    const signOpts: SignOptions = {
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

  // <<< ADICIONEI ESTE >>>
  async register(nome: string, email: string, senha: string) {
    if (!nome?.trim()) {
      const err = new Error("nome é obrigatório");
      (err as any).status = 400; throw err;
    }
    if (!email?.trim()) {
      const err = new Error("email é obrigatório");
      (err as any).status = 400; throw err;
    }
    if (!senha || senha.length < 6) {
      const err = new Error("senha deve ter ao menos 6 caracteres");
      (err as any).status = 400; throw err;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await usuariosRepo.getByEmail(normalizedEmail);

    if (existing) {
      if (existing.verificado) {
        const err = new Error("email já cadastrado");
        (err as any).status = 409; throw err;
      }
      // reenvia verificação para não verificado
      await verificationService.requestByEmail(normalizedEmail);
      const { passwordHash: _ph, ...publicUser } = existing as any;
      return { mode: "resent" as const, message: "Verificação reenviada.", user: publicUser };
    }

    const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const created = await usuariosRepo.create({
      nome: nome.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // envia verificação
    await verificationService.requestByEmail(normalizedEmail);

    const { passwordHash: _ph2, ...publicUser } = created as any;
    return { mode: "created" as const, message: "Usuário criado. E-mail de verificação enviado.", user: publicUser };
  },
};
