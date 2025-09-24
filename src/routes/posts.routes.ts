/**
 * @openapi
 * /posts:
 *   get:
 *     summary: Lista meus posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
 
/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validação falhou
 */
 
/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Busca um post por id (meu; admin pode qualquer)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 */


import { Router } from "express";
import { postsController } from "../controllers/posts.controller";
import { auth } from "../middlewares/auth";
import { requireVerified } from "../middlewares/requireVerified";

const router = Router();

router.use(auth, requireVerified);

// como o prefixo já vem de index.ts ("/posts"),
// aqui use caminhos RELATIVOS:
router.post("/", postsController.create);        // POST /posts
router.get("/", postsController.listMine);       // GET  /posts
router.get("/:id", postsController.get);         // GET  /posts/:id
router.put("/:id", postsController.update);      // PUT  /posts/:id
router.delete("/:id", postsController.remove);   // DEL  /posts/:id

export default router;
