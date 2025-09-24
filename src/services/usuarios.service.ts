import bcrypt from "bcryptjs";
import { usuariosRepo } from "../repositories/usuarios.repo";
import { Prisma } from "@prisma/client";

const SALT_ROUNDS = 10;

export const usuariosService = {
  // Desative ou proteja por role admin
  list() {
    return usuariosRepo.list();
  },

  get(id: number) {
    return usuariosRepo.get(id);
  },

  async create(nome: string, email: string, senha: string) {
    if (!nome?.trim()) throw Object.assign(new Error("nome é obrigatório"), { status: 400 });
    if (!email?.trim()) throw Object.assign(new Error("email é obrigatório"), { status: 400 });
    if (!senha || senha.length < 6)
      throw Object.assign(new Error("senha deve ter ao menos 6 caracteres"), { status: 400 });

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await usuariosRepo.getByEmail(normalizedEmail);
    if (exists) throw Object.assign(new Error("email já cadastrado"), { status: 409 });

    const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);

    return usuariosRepo.create({
      nome: nome.trim(),
      email: normalizedEmail,
      passwordHash,
    });
  },

  async update(
    id: number,
    payload: { nome?: string; email?: string; senha?: string; verificado?: boolean }
  ) {
    const data: any = {};

    if (payload.nome !== undefined) {
      if (!payload.nome.trim())
        throw Object.assign(new Error("nome não pode ser vazio"), { status: 400 });
      data.nome = payload.nome.trim();
    }

    if (payload.email !== undefined) {
      const normalizedEmail = payload.email.trim().toLowerCase();
      if (!normalizedEmail)
        throw Object.assign(new Error("email inválido"), { status: 400 });
      data.email = normalizedEmail;

      // Opcional (recomendado): ao mudar email, exigir nova verificação
      // data.verificado = false;
      // aqui você pode disparar verificationService.requestByEmail(normalizedEmail)
      // (talvez melhor fazer isso no controller para não acoplar serviço de e-mail ao de usuário)
    }

    if (payload.senha !== undefined) {
      if (payload.senha.length < 6)
        throw Object.assign(new Error("senha deve ter ao menos 6 caracteres"), { status: 400 });
      data.passwordHash = await bcrypt.hash(payload.senha, SALT_ROUNDS);

      // Opcional: invalidar/rotacionar tokens existentes
    }

    if (payload.verificado !== undefined) {
      data.verificado = !!payload.verificado;
    }

    try {
      return await usuariosRepo.update(id, data);
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          // Unique constraint (provavelmente email)
          const err = new Error("email já cadastrado");
          (err as any).status = 409;
          throw err;
        }
        if (e.code === "P2025") {
          // Record not found
          const err = new Error("usuário não encontrado");
          (err as any).status = 404;
          throw err;
        }
      }
      throw e;
    }
  },

  async remove(id: number) {
    try {
      return await usuariosRepo.remove(id);
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        const err = new Error("usuário não encontrado");
        (err as any).status = 404;
        throw err;
      }
      throw e;
    }
  },
};
