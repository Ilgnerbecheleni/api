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
router.post("/auth/register", authController.register);


router.get("/me", auth,requireVerified, async (req, res, next) => {
try {
const user = await usuariosRepo.get(req.user!.sub);
if (!user) return res.status(404).json({ error: { message: "Usuário não encontrado" } });
const { passwordHash, ...publicUser } = user as any;
res.json(publicUser);
} catch (e) { next(e); }
});


export default router;