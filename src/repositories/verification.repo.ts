import { prisma } from "../lib/prisma";


export const verificationRepo = {
    create(userId: number, token: string, expiresAt: Date) {
        return prisma.verificationToken.create({ data: { userId, token, expiresAt } });
    },
    getByToken(token: string) {
        return prisma.verificationToken.findUnique({ where: { token } });
    },
    markUsed(id: number) {
        return prisma.verificationToken.update({ where: { id }, data: { usedAt: new Date() } });
    },
    invalidateAllForUser(userId: number) {
        return prisma.verificationToken.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } });
    },
};