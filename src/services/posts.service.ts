import { postsRepo } from "../repositories/posts.repo";
import { isAdmin } from "../lib/roles";

type UpdatePayload = { titulo?: string; conteudo?: string; data?: string };

export const postsService = {
  async create(authorId: number, titulo: string, conteudo: string, data?: string) {
    if (!titulo?.trim()) throw Object.assign(new Error("titulo é obrigatório"), { status: 400 });
    if (!conteudo?.trim()) throw Object.assign(new Error("conteudo é obrigatório"), { status: 400 });

    const when = data ? new Date(data) : undefined;
    if (when && isNaN(when.getTime())) throw Object.assign(new Error("data inválida"), { status: 400 });

    return postsRepo.create(authorId, {
      titulo: titulo.trim(),
      conteudo: conteudo.trim(),
      data: when,
    });
  },

  listMine(authorId: number) {
    return postsRepo.listByAuthor(authorId);
  },

  // Busca um post; autor vê o seu, admin vê qualquer um
  async getById(requesterId: number, id: number) {
    const admin = await isAdmin(requesterId);
    if (admin) {
      const post = await postsRepo.getById(id);
      if (!post) throw Object.assign(new Error("post não encontrado"), { status: 404 });
      return post;
    } else {
      const post = await postsRepo.getByIdForAuthor(id, requesterId);
      if (!post) throw Object.assign(new Error("post não encontrado"), { status: 404 });
      return post;
    }
  },

  // Atualiza; autor só o seu, admin qualquer
  async update(requesterId: number, id: number, payload: UpdatePayload) {
    const admin = await isAdmin(requesterId);

    // ownership check quando não admin
    if (!admin) {
      const existing = await postsRepo.getByIdForAuthor(id, requesterId);
      if (!existing) throw Object.assign(new Error("post não encontrado"), { status: 404 });
    } else {
      // se admin, garanta que o post existe
      const exists = await postsRepo.getById(id);
      if (!exists) throw Object.assign(new Error("post não encontrado"), { status: 404 });
    }

    const data: any = {};

    if (payload.titulo !== undefined) {
      if (!payload.titulo.trim()) throw Object.assign(new Error("titulo não pode ser vazio"), { status: 400 });
      data.titulo = payload.titulo.trim();
    }
    if (payload.conteudo !== undefined) {
      if (!payload.conteudo.trim()) throw Object.assign(new Error("conteudo não pode ser vazio"), { status: 400 });
      data.conteudo = payload.conteudo.trim();
    }
    if (payload.data !== undefined) {
      const when = new Date(payload.data);
      if (isNaN(when.getTime())) throw Object.assign(new Error("data inválida"), { status: 400 });
      data.data = when;
    }

    return postsRepo.updateById(id, data);
  },

  // Remove; autor só o seu, admin qualquer
  async remove(requesterId: number, id: number) {
    const admin = await isAdmin(requesterId);

    if (!admin) {
      const existing = await postsRepo.getByIdForAuthor(id, requesterId);
      if (!existing) throw Object.assign(new Error("post não encontrado"), { status: 404 });
    } else {
      const exists = await postsRepo.getById(id);
      if (!exists) throw Object.assign(new Error("post não encontrado"), { status: 404 });
    }

    await postsRepo.deleteById(id);
  },
};
