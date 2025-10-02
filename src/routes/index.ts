import { Router } from "express";
import helloRoutes from "./hello.routes";
import healthRoutes from "./health.routes";
import usuariosRoutes from "./usuarios.routes";
import authRoutes from "./auth.routes";
import verificationRoutes from "./verification.routes";
import adminRoutes from "./admin.routes";

const router = Router();


router.use(healthRoutes);
router.use("/hello", helloRoutes); // prefixo /hello
router.use("/usuarios", usuariosRoutes);

router.use(authRoutes);
router.use(verificationRoutes);
router.use(adminRoutes);
export default router;