export const env = {
JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
};