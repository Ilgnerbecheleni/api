import { Router } from "express";
import { helloController } from "../controllers/hello.controller";


const router = Router();


// GET /hello/
router.get("/", helloController.sayHello);


export default router;