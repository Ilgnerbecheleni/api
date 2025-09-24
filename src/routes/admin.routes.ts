import { Router } from "express";
import { authorizeAdmin } from "../middlewares/authorize";
import { auth } from "../middlewares/auth";
import { adminController } from "../controllers/admin.controller";


const router = Router();


router.use(auth, authorizeAdmin());


router.get("/admin/users", adminController.listUsers);
router.put("/admin/users/:id/role", adminController.setRole);


export default router;