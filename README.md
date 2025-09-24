# API Express + TypeScript — Prisma, JWT, Verificação por E‑mail, RBAC e Posts

Um boilerplate **limpo e profissional** em Express + TypeScript com:

- **Prisma** (SQLite no dev; fácil trocar para Postgres)
- **Auth JWT** (login e `/me`)
- **Verificação de e‑mail** (Gmail SMTP com Senha de App)
- **RBAC simples** (`USER`/`ADMIN` + `SUPER_ADMINS` via `.env`)
- **Posts**: CRUD restrito a usuário logado (e verificado); admin pode tudo
- **Arquitetura em camadas**: `routes → controllers → services → repositories` + middlewares de auth/roles

---

## ⚙️ Stack
- Node 18+
- Express 4
- TypeScript 5
- Prisma + SQLite (dev)
- jsonwebtoken 9
- bcryptjs
- Nodemailer (Gmail SMTP)

---

## 🗂️ Estrutura sugerida
```
src/
  app.ts
  server.ts
  config/
    env.ts
  controllers/
  middlewares/
  repositories/
  services/
  routes/
  lib/
  @types/express/index.d.ts  # augment de Request.user
prisma/
  schema.prisma
```

---

## 🚀 Primeiros passos

```bash
# 1) Instalar dependências
npm i

# 2) Configurar .env (exemplo abaixo)

# 3) Prisma (gerar + migrar)
npx prisma generate
npx prisma migrate dev --name init

# 4) Rodar em dev
npm run dev
# API em http://localhost:3000
```

### 🔐 `.env.example`
```env
# App
PORT=3000
APP_URL="http://localhost:3000"

# DB (dev com SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="sua_chave_bem_grande_e_aleatoria"
JWT_EXPIRES_IN="15m"

# E-mail (Gmail SMTP com Senha de App)
GMAIL_USER="seu_email@gmail.com"
GMAIL_PASS="SENHA_DE_APP_16_CHARS"

# RBAC (super admins por e-mail)
SUPER_ADMINS="admin@empresa.com, outro@gmail.com"
```
> **Gmail:** ative 2FA e gere **Senha de App**. Senha comum não funciona no SMTP (erro 535).

---

## 🗃️ Banco de Dados (Prisma)

**Modelos principais:**

- `Usuario { id, nome, email(unique), passwordHash, verificado, role, criadoEm, atualizadoEm }`
- `VerificationToken { id, token(unique), userId, expiresAt, usedAt, createdAt }`
- `Post { id, titulo, conteudo, data, authorId }`

Comandos úteis:

```bash
npx prisma migrate dev --name <nome>
npx prisma studio  # GUI do Prisma
```

---

## ▶️ Scripts (package.json)

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

## 🔐 Autenticação & Autorização

- **Registro**: `POST /auth/register` → cria usuário e **envia verificação**
- **Login**: `POST /auth/login` → `{ token, user }`
- **JWT**: payload inclui `sub` (userId), `email` e opcional `nome`
- **/me**: `GET /me` (requer token) → retorna dados do usuário
- **Verificação**:  
  - `POST /auth/request-verify` (envia e-mail)  
  - `GET /auth/verify?token=...` (confirma)  
  - `requireVerified` bloqueia rotas sensíveis (ex.: posts) para não verificados
- **RBAC**:  
  - `Role` no DB: `USER` | `ADMIN`  
  - `SUPER_ADMINS` no `.env` (lista de e-mails com poderes máximos)  
  - `authorizeAdmin()` protege rotas admin

---

## 🧭 Endpoints

### Health & Hello
- `GET /health` → status da API
- `GET /hello?name=Gui` → `{ "message": "Olá, Gui!" }`

### Auth & Usuário
- `POST /auth/register` → cria usuário e envia verificação
- `POST /auth/login` → `{ token, user }`
- `GET /me` → perfil do usuário logado
- `POST /auth/request-verify` → reenvia verificação
- `GET /auth/verify?token=...` → verifica e-mail

### Admin
- `GET /admin/users` → lista todos os usuários (sem passwordHash)
- `PUT /admin/users/:id/role` → define `role` (`USER` | `ADMIN`)

### Posts (login **e verificação** obrigatórios)
> **Escopo privado**: o usuário vê/edita/deleta **apenas os seus**; **admin** pode tudo.
- `POST /posts` → cria post do usuário logado
- `GET /posts` → lista **meus** posts
- `GET /posts/:id` → busca **meu** post (ou qualquer se admin)
- `PUT /posts/:id` → atualiza **meu** post (ou qualquer se admin)
- `DELETE /posts/:id` → remove **meu** post (ou qualquer se admin)

---

## 🧪 Exemplos (curl)

### Registro + verificação + login
```bash
# registrar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Gui","email":"seu_email@gmail.com","senha":"123456"}'

# reenvio (se precisar)
curl -X POST http://localhost:3000/auth/request-verify \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@gmail.com"}'

# clique no link do e-mail → /auth/verify?token=...

# login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@gmail.com","senha":"123456"}' | jq -r .token)
```

### Posts
```bash
# criar post
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Meu post","conteudo":"Olá!"}'

# listar meus posts
curl http://localhost:3000/posts -H "Authorization: Bearer $TOKEN"

# obter/editar/remover
curl http://localhost:3000/posts/1 -H "Authorization: Bearer $TOKEN"
curl -X PUT http://localhost:3000/posts/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"titulo":"Novo título"}'
curl -X DELETE http://localhost:3000/posts/1 -H "Authorization: Bearer $TOKEN" -i
```

---

## 🧱 Middlewares importantes

- `auth` → extrai e valida JWT; popula `req.user`
- `requireVerified` → bloqueia usuário não verificado (retorna 403 com dica de reenvio)
- `allowSelf("id")` → restringe acesso ao próprio recurso (libera admin)
- `authorizeAdmin()` → exige papel admin (ou super admin do `.env`)
- `errorHandler` → trata exceções e padroniza resposta `{ error: { message, status, stack? } }`

---

## 🐞 Troubleshooting

- **Cannot POST /posts** → verifique prefixo de rotas: se `router.use("/posts", postRoutes)`, então dentro do módulo use caminhos **relativos** (`"/"`, `"/:id"`).
- **401 token ausente/inválido** → confira header `Authorization: Bearer <token>`.
- **403 verificação** → use `POST /auth/request-verify` e confirme o e-mail.
- **Gmail 535** → use **Senha de App**; verifique `from = GMAIL_USER` e `import "dotenv/config"` no entrypoint.
- **Prisma P2002** (unique) → e-mail duplicado; retornamos 409.
- **Prisma P2025** (not found) → traduza para 404 quando aplicável.

---

## 📦 Deploy (resumo rápido)

- Troque `DATABASE_URL` para Postgres (Railway/Supabase/Neon/etc.)
- Rode `npx prisma migrate deploy`
- Ajuste `APP_URL` para o domínio
- Configure `GMAIL_USER/PASS`, `JWT_SECRET`, `SUPER_ADMINS`

---

## ✅ Roadmap (próximos passos sugeridos)

- Validações com **Zod** (DTOs)
- **Refresh token** + rotação/blacklist
- Templates de e-mail HTML bonitos + **Resend/Mailgun/SES** em produção
- **Rate limit** nas rotas sensíveis
- Logger estruturado (pino/winston)
- Testes (Vitest/Jest + Supertest)
