import { prisma } from "../lib/prisma";

export const mqttUsersRepo = {
  async getByUserId(userId: number) {
    return prisma.mqttUser.findUnique({
      where: { userId }, // 1:1 garantido pelo @unique
      include: { user: { select: { id: true, nome: true, email: true } } },
    });
  },

  async createForUser(userId: number, username: string, password: string) {
    return prisma.mqttUser.create({
      data: { userId, username, password },
      include: { user: { select: { id: true, nome: true, email: true } } },
    });
  },

  async updateForUser(userId: number, username: string, password: string) {
    // como userId é unique, podemos usar update com where.userId
    return prisma.mqttUser.update({
      where: { userId },
      data: { username, password },
      include: { user: { select: { id: true, nome: true, email: true } } },
    });
  },

  async removeForUser(userId: number) {
    return prisma.mqttUser.delete({
      where: { userId },
    });
  },

  /** Admin: lista todos (paginação básica) */
  async listAll(skip: number, take: number, q?: string) {
    const where = q ? { username: { contains: q, mode: "insensitive" } } : {};
    const [items, total] = await Promise.all([
      prisma.mqttUser.findMany({
        where, skip, take, orderBy: { id: "desc" },
        include: { user: { select: { id: true, nome: true, email: true } } },
      }),
      prisma.mqttUser.count({ where }),
    ]);
    return { items, total };
  },
};
