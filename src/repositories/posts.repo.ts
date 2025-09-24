import { prisma } from "../lib/prisma";

export const postsRepo = {
  create(authorId: number, data: { titulo: string; conteudo: string; data?: Date }) {
    return prisma.post.create({ data: { ...data, authorId } });
  },

  // lista só do autor
  listByAuthor(authorId: number) {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { id: "desc" },
    });
  },

  getById(id: number) {
  return prisma.post.findUnique({ where: { id } });
},
  // pega um post garantindo dono
  getByIdForAuthor(id: number, authorId: number) {
    return prisma.post.findFirst({ where: { id, authorId } });
  },

  // update por id (ownership é checada no service)
  updateById(id: number, data: Partial<{ titulo: string; conteudo: string; data: Date }>) {
    return prisma.post.update({ where: { id }, data });
  },

  deleteById(id: number) {
    return prisma.post.delete({ where: { id } });
  },
};
