import { usuariosRepo } from "../repositories/usuarios.repo";


export async function isAdmin(userId: number): Promise<boolean> {
const superAdmins = (process.env.SUPER_ADMINS || "")
.split(",")
.map((s) => s.trim().toLowerCase())
.filter(Boolean);


const user = await usuariosRepo.get(userId);
if (!user) return false;
const emailIsSuper = superAdmins.includes(user.email.toLowerCase());
return emailIsSuper || user.role === "ADMIN";
}


export function requireEnvAdminList(): string[] {
return (process.env.SUPER_ADMINS || "")
.split(",")
.map((s) => s.trim().toLowerCase())
.filter(Boolean);
}