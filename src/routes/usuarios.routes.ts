import { Router } from "express";
import { usuariosController } from "../controllers/usuarios.controller";
import { auth } from "../middlewares/auth";
import { allowSelf } from "../middlewares/allowSelf";


const router = Router();


// REMOVER (ou comentar) a listagem geral:
// router.get("/", usuariosController.list);


// Recursos por ID — somente o dono
router.get("/:id", auth, allowSelf("id"), usuariosController.get);
router.put("/:id", auth, allowSelf("id"), usuariosController.update);
router.delete("/:id", auth, allowSelf("id"), usuariosController.remove);


export default router;