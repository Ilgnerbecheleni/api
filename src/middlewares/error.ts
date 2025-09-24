import type { Request, Response, NextFunction } from "express";


export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
const status = err.status ?? err.statusCode ?? 500;
const isProd = process.env.NODE_ENV === "production";


res.status(status).json({
error: {
message: err.message ?? "Internal Server Error",
status,
...(isProd ? {} : { stack: err.stack })
}
});
}