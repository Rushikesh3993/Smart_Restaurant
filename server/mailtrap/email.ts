import {
    generatePasswordResetEmailHtml,
    generateResetSuccessEmailHtml,
    generateWelcomeEmailHtml,
    htmlContent,
  } from "./htmlEmail";
  import { client, sender } from "./mailtrap"; // or emailClient if you renamed it
  
  export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const html = htmlContent.replace("{verificationToken}", verificationToken);
    try {
      const res = await client.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Verify your email",
        htmlContent: html,
        headers: { category: "Email Verification" },
      });
      console.log("Verification email sent:", res);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send email verification");
    }
  };
  
  export const sendWelcomeEmail = async (email: string, name: string) => {
    const html = generateWelcomeEmailHtml(name);
    try {
      const res = await client.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Welcome to FoodiNest",
        htmlContent: html,
      });
      console.log("Welcome email sent:", res);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  };
  
  export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const html = generatePasswordResetEmailHtml(resetURL);
    try {
      const res = await client.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Reset your password",
        htmlContent: html,
      });
      console.log("Password reset email sent:", res);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  };
  
  export const sendResetSuccessEmail = async (email: string) => {
    const html = generateResetSuccessEmailHtml();
    try {
      const res = await client.sendTransacEmail({
        sender,
        to: [{ email }],
        subject: "Password Reset Successfully",
        htmlContent: html,
      });
      console.log("Password reset success email sent:", res);
    } catch (error) {
      console.error("Error sending password reset success email:", error);
      throw new Error("Failed to send password reset success email");
    }
  };
  