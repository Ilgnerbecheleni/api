import { Router } from "express";
import { verificationController } from "../controllers/verification.controller";


const router = Router();


router.post("/auth/request-verify", verificationController.request);
router.get("/auth/verify", verificationController.verify);


export default router;