import nodemailer from "nodemailer";

import nodemailer from "nodemailer";

export async function sendWithGmail(to, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      family: 4, 
    });

    await transporter.sendMail({
      from: `"PayTrack" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your OTP Code",
      html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:24px; border-radius:10px;">

          <h2 style="color:#4f46e5; text-align:center;">
            🔐 Verify Your Email
          </h2>

          <p>Use the OTP below:</p>

          <div style="text-align:center; margin:20px 0;">
            <h1 style="letter-spacing:6px;">
              ${otp}
            </h1>
          </div>

          <p>OTP valid for 10 minutes.</p>

        </div>
      </div>
      `,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Gmail Error:", error);
    throw error;
  }
}

// src/utils/mailer.brevo.js
import Brevo from "@getbrevo/brevo";

export async function sendWithBrevo(to, otp) {
  const api = new Brevo.TransactionalEmailsApi();

  api.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
  );

  const email = new Brevo.SendSmtpEmail();

  email.sender = {
    email: process.env.BREVO_SENDER_EMAIL, // must be authenticated
    name: process.env.BREVO_SENDER_NAME || "PayTrack",
  };

  email.to = [{ email: to }];
  email.subject = "Verify your account";

  email.htmlContent = `
      <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6fb; padding:20px;">
  <div style="max-width:500px; margin:auto; background:#ffffff; padding:24px; border-radius:10px; box-shadow:0 6px 20px rgba(0,0,0,0.08);">

    <h2 style="color:#4f46e5; text-align:center;">
      🔐 Verify Your Email
    </h2>

    <p style="color:#374151; font-size:14px;">
      Thank you for signing up with <strong>MyApp Payments</strong>.
    </p>

    <p style="color:#374151; font-size:14px;">
      To securely verify your account and enable payment features, please use the One-Time Password (OTP) below:
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
      ⚠️ For your security, <strong>do not share this OTP</strong> with anyone — our team will never ask for it.
    </p>

    <hr style="margin:20px 0; border:none; border-top:1px solid #e5e7eb;" />

    <p style="font-size:12px; color:#6b7280;">
      If you did not attempt to create an account or make a payment, please ignore this email or contact our support immediately.
    </p>

    <p style="font-size:12px; color:#6b7280;">
      © ${new Date().getFullYear()} MyApp Payments. All rights reserved.
    </p>

  </div>
</div>

    `;

  try {
    return await api.sendTransacEmail(email);
  } catch (error) {
    console.error("Brevo email error:", error.response?.body || error);
    throw error;
  }
}

