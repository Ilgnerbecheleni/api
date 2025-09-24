import type { Request, Response, NextFunction } from "express";
import { helloService } from "../services/hello.service";


export const helloController = {
async sayHello(req: Request, res: Response, next: NextFunction) {
try {
const name = (req.query.name as string) || "mundo";
const message = await helloService.composeHello(name);
res.json({ message });
} catch (err) {
next(err);
}
},
};