# === Builder ===
FROM node:20-alpine AS builder
WORKDIR /app

# dependências
COPY package*.json ./
RUN npm ci

# prisma + código
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# gerar prisma client e build TS
RUN npx prisma generate
RUN npm run build

# === Runner ===
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copiar apenas o necessário
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# porta (altere se precisar)
ENV PORT=3000
EXPOSE 3000

# HEALTHCHECK opcional:
# HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
