export function toSlugBase(s: string) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // não-letras vira "_"
    .replace(/^_+|_+$/g, ""); // trim underscores
}

export function buildMqttUsername(userId: number, nome: string) {
  const base = toSlugBase(nome);
  // Ex.: u12_gui_silva  (único por causa do id)
  return `u${userId}_${base}`;
}

export function buildMqttPassword(userId: number, nome: string) {
  const base = toSlugBase(nome);
  // ATENÇÃO: exigência do cliente: também id+nome
  // Ex.: p12_gui_silva
  return `p${userId}_${base}`;
}

/** Útil para organizar a “plataforma MQTT” por tenant */
export function userMqttNamespace(userId: number) {
  return `tenants/${userId}`; // exemplo: tenants/12/#
}
