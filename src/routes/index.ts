import { Router } from "express";
import helloRoutes from "./hello.routes";
import healthRoutes from "./health.routes";
import usuariosRoutes from "./usuarios.routes";
import authRoutes from "./auth.routes";
import verificationRoutes from "./verification.routes";
import adminRoutes from "./admin.routes";
import postRoutes from './posts.routes'
const router = Router();


router.use(healthRoutes);
router.use("/hello", helloRoutes); // prefixo /hello
router.use("/usuarios", usuariosRoutes);
router.use("/posts", postRoutes);
router.use(authRoutes);
router.use(verificationRoutes);
router.use(adminRoutes);
export default router;