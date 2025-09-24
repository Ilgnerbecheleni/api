/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 */

import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { auth } from "../middlewares/auth";
import { usuariosRepo } from "../repositories/usuarios.repo";
import { requireVerified } from "../middlewares/requireVerified";


const router = Router();


router.post("/auth/login", authController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registro de usuário (envia e-mail de verificação automaticamente)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Usuário criado e e-mail de verificação enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado. E-mail de verificação enviado.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       202:
 *         description: E-mail já cadastrado porém não verificado — reenvio do e-mail de verificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verificação reenviada.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos (nome/email/senha)
 *       409:
 *         description: E-mail já cadastrado e verificado
 */
router.post("/auth/register", authController.register);


/**
 * @openapi
 * /me:
 *   get:
 *     summary: Retorna o perfil do usuário logado (requer e-mail verificado)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Conta não verificada
 *       404:
 *         description: Usuário não encontrado
 */


router.get("/me", auth,requireVerified, async (req, res, next) => {
try {
const user = await usuariosRepo.get(req.user!.sub);
if (!user) return res.status(404).json({ error: { message: "Usuário não encontrado" } });
const { passwordHash, ...publicUser } = user as any;
res.json(publicUser);
} catch (e) { next(e); }
});


export default router;