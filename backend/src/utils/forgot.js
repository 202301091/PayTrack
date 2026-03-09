import nodemailer from "nodemailer";
import Brevo from "@getbrevo/brevo";

function forgotPasswordTemplate(otp) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6fb; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#ffffff; padding:24px; border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.08);">

      <h2 style="color:#4f46e5; text-align:center;">
        🔑 Password Reset Request
      </h2>

      <p style="color:#374151; font-size:14px;">
        We received a request to reset your password for <strong>MyApp Payments</strong>.
      </p>

      <p style="color:#374151; font-size:14px;">
        Use the One-Time Password (OTP) below to reset your password:
      </p>

      <div style="text-align:center; margin:20px 0;">
        <h1 style="letter-spacing:6px; color:#111827;">
          ${otp}
        </h1>
      </div>

      <p style="color:#374151; font-size:14px;">
        ⏳ This OTP is valid for <strong>10 minutes</strong>.
      </p>

      <p style="color:#374151; font-size:14px;">
        ⚠️ If you did not request a password reset, please ignore this email.
      </p>

      <hr style="margin:20px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#6b7280;">
        For security reasons, never share this code with anyone.
      </p>

      <p style="font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} MyApp Payments. All rights reserved.
      </p>

    </div>
  </div>
  `;
}
export async function forgotWithGmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"My App" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: forgotPasswordTemplate(otp),
  });
}

export async function forgotWithBrevo(to, otp) {
  const api = new Brevo.TransactionalEmailsApi();

  api.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const email = new Brevo.SendSmtpEmail();

  email.sender = {
    email: process.env.BREVO_SENDER_EMAIL,
    name: process.env.BREVO_SENDER_NAME || "My App",
  };

  email.to = [{ email: to }];
  email.subject = "Reset Your Password";
  email.htmlContent = forgotPasswordTemplate(otp);

  try {
    return await api.sendTransacEmail(email);
  } catch (error) {
    console.error("Brevo email error:", error.response?.body || error);
    throw error;
  }
}