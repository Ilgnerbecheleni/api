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
