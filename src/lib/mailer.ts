import nodemailer from "nodemailer";


const { GMAIL_USER, GMAIL_PASS } = process.env as Record<string, string>;


export const mailer = nodemailer.createTransport({
service: "gmail",
auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});


export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
if (!GMAIL_USER) throw new Error("GMAIL_USER ausente no .env");
await mailer.sendMail({ from: GMAIL_USER, to, subject, html });
}