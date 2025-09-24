// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Necessário para poder anexar ao escopo global em dev (hot-reload)
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma__ ??
  new PrismaClient({
    log: ["warn", "error"], // coloque "query" em dev se quiser
  });

// Em dev, guarda no global para não criar múltiplas instâncias a cada reload
if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma__ = prisma;
}
