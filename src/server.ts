// src/server.ts
import { createApp } from "./app";
import { prisma } from "./lib/prisma";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "localhost";

async function bootstrap() {
  await prisma.$connect(); // garante conexão no boot
  const app = createApp();

  const server = app.listen(PORT, HOST, () => {
    console.log(`✅ API ouvindo em http://${HOST}:${PORT}`);
  });

  // shutdown gracioso
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  });
}

bootstrap().catch(async (err) => {
  console.error("Falha ao subir:", err);
  await prisma.$disconnect();
  process.exit(1);
});
