import crypto from "crypto";
import { usuariosRepo } from "../repositories/usuarios.repo";
import { verificationRepo } from "../repositories/verification.repo";
import { sendMail } from "../lib/mailer";


const APP_URL = process.env.APP_URL || "http://localhost:3000";


export const verificationService = {
    async requestByEmail(email: string) {
        if (!email?.trim()) {
            const err = new Error("email é obrigatório");
            (err as any).status = 400;
            throw err;
        }
        const normalized = email.trim().toLowerCase();
        const user = await usuariosRepo.getByEmail(normalized);
        if (!user) {
            // Para não vazar existência do e-mail, responda 204/200 mesmo assim
            return;
        }
        if (user.verificado) return; // já verificado


        // Invalida tokens anteriores
        await verificationRepo.invalidateAllForUser(user.id);


        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
        await verificationRepo.create(user.id, token, expiresAt);


        const link = `${APP_URL}/auth/verify?token=${token}`;


        await sendMail({
            to: user.email,
            subject: "Verifique seu e-mail",
            html: `
                <h2>Confirme seu e-mail</h2>
                <p>Olá, ${user.nome}. Clique no link abaixo para verificar sua conta:</p>
                <p><a href="${link}">Verificar e-mail</a></p>
                <p>Este link expira em 24 horas.</p>
                  `,
        });
    },


    async verifyByToken(token: string) {
        if (!token) {
            const err = new Error("token é obrigatório");
            (err as any).status = 400;
            throw err;
        }
        const vt = await verificationRepo.getByToken(token);
        if (!vt || vt.usedAt) {
            const err = new Error("token inválido ou já utilizado");
            (err as any).status = 400;
            throw err;
        }
        if (vt.expiresAt.getTime() < Date.now()) {
            const err = new Error("token expirado");
            (err as any).status = 400;
            throw err;
        }


        // Marca usuário como verificado e token como usado
        await usuariosRepo.update(vt.userId, { verificado: true });
        await verificationRepo.markUsed(vt.id);


        return { ok: true };
    },
};