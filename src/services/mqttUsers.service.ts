import { usuariosRepo } from "../repositories/usuarios.repo";
import { mqttUsersRepo } from "../repositories/mqttUsers.repo";
import { buildMqttPassword, buildMqttUsername, userMqttNamespace } from "../utils/mqtt-cred";

function httpError(status: number, message: string) {
  const e: any = new Error(message);
  e.status = status;
  return e;
}

export const mqttUsersService = {
  /**
   * Cria as credenciais 1:1 do usuário :id.
   * Se já existir, retorna 409.
   */
  async createForUser(userId: number) {
    const user = await usuariosRepo.get(userId);
    if (!user) throw httpError(404, "Usuário não encontrado.");

    const existing = await mqttUsersRepo.getByUserId(userId);
    if (existing) throw httpError(409, "Este usuário já possui credenciais MQTT.");

    const username = buildMqttUsername(user.id, user.nome);
    const password = buildMqttPassword(user.id, user.nome);

    const created = await mqttUsersRepo.createForUser(user.id, username, password);
    const namespace = userMqttNamespace(user.id);
    return { ...created, namespace };
  },

  /**
   * Obtém credenciais 1:1 do usuário :id (expondo username/password).
   */
  async getForUser(userId: number) {
    const item = await mqttUsersRepo.getByUserId(userId);
    if (!item) throw httpError(404, "Credenciais MQTT não encontradas.");
    const namespace = userMqttNamespace(userId);
    return { ...item, namespace };
  },

  /**
   * Regera username/password a partir do nome atual do perfil.
   */
  async regenerateForUser(userId: number) {
    const user = await usuariosRepo.get(userId);
    if (!user) throw httpError(404, "Usuário não encontrado.");

    const current = await mqttUsersRepo.getByUserId(userId);
    if (!current) throw httpError(404, "Credenciais MQTT não encontradas.");

    const username = buildMqttUsername(user.id, user.nome);
    const password = buildMqttPassword(user.id, user.nome);

    const updated = await mqttUsersRepo.updateForUser(user.id, username, password);
    const namespace = userMqttNamespace(user.id);
    return { ...updated, namespace };
  },

  /**
   * Remove credenciais 1:1 do usuário :id.
   */
  async removeForUser(userId: number) {
    const current = await mqttUsersRepo.getByUserId(userId);
    if (!current) throw httpError(404, "Credenciais MQTT não encontradas.");
    await mqttUsersRepo.removeForUser(userId);
    return { message: "Credenciais MQTT removidas." };
  },

  /** Admin */
  async adminList(params: { page?: number; perPage?: number; q?: string }) {
    const page = Math.max(1, Number(params.page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(params.perPage) || 10));
    const skip = (page - 1) * perPage;
    const { items, total } = await mqttUsersRepo.listAll(skip, perPage, params.q);
    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  },
};
