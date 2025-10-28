import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import nodemailer from "nodemailer";

export default async function handleSendResetPassword({
  event,
}: SubscriberArgs<Record<string, any>>) {
  if (!event || !event.data) {
    console.warn("⚠️ No event data received");
    return;
  }

  const { token, entity_id } = event.data as {
    token?: string;
    entity_id?: string;
  };

  const email = entity_id; // ✅ entity_id chính là email

  if (!email) {
    console.error("❌ No email found in event data:", event.data);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    console.log(`✅ Sent password reset email to: ${email}`);
  } catch (err) {
    console.error("❌ Error sending password reset email:", err);
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};