export function toSlugBase(s: string) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildMqttUsername(userId: number, nome: string) {
  const base = toSlugBase(nome);
  // único por conter id
  return `u${userId}_${base}`;
}

export function buildMqttPassword(userId: number, nome: string) {
  const base = toSlugBase(nome);
  // você pediu id+nome para o password também
  return `p${userId}_${base}`;
}

export function userMqttNamespace(userId: number) {
  return `tenants/${userId}`;
}
