import { prisma } from "../lib/prisma";


export const usuariosRepo = {
    list() {
        return prisma.usuario.findMany({ orderBy: { id: "desc" } });
    },
    get(id: number) {
        return prisma.usuario.findUnique({ where: { id } });
    },
    getByEmail(email: string) {
        return prisma.usuario.findUnique({ where: { email } });
    },
    create(data: { nome: string; email: string; passwordHash: string; verificado?: boolean }) {
        return prisma.usuario.create({ data });
    },
    update(id: number, data: Partial<{ nome: string; email: string; passwordHash: string; verificado: boolean; role: "USER" | "ADMIN" }>) {
        return prisma.usuario.update({ where: { id }, data });
    },
    remove(id: number) {
        return prisma.usuario.delete({ where: { id } });
    },
};