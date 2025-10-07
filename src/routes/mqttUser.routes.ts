import { Router } from "express";
import { auth } from "../middlewares/auth";
import { requireVerified } from "../middlewares/requireVerified";
import { allowSelf } from "../middlewares/allowSelf";
import { authorizeAdmin } from "../middlewares/authorize";
import { mqttUsersController } from "../controllers/mqttUsers.controller";

const router = Router();

/**
 * Fluxo:
 * - Autentica e garante verificação de e-mail.
 * - Para rotas de usuário, aplica allowSelf("id") → somente o dono (ou admin).
 * - Para admin, aplica authorizeAdmin().
 */

router.use(auth, requireVerified);

// user-scoped (1:1)
router.post("/users/:id/mqtt-credentials", allowSelf("id"), mqttUsersController.create);
router.get("/users/:id/mqtt-credentials", allowSelf("id"), mqttUsersController.get);
router.patch("/users/:id/mqtt-credentials/regen", allowSelf("id"), mqttUsersController.regenerate);
router.delete("/users/:id/mqtt-credentials", allowSelf("id"), mqttUsersController.remove);

// admin
router.get("/admin/mqtt-users", authorizeAdmin(), mqttUsersController.adminList);

export default router;
