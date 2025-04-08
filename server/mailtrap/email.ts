import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [{ email }];
    try {
        const sendSmtpEmail = {
            sender: sender,
            to: recipient,
            subject: 'Verify your email',
            htmlContent: htmlContent.replace("{verificationToken}", verificationToken),
            headers: { "category": "Email Verification" }
        };

        const res = await client.sendTransacEmail(sendSmtpEmail);
        console.log("Verification email sent:", res);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send email verification");
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    const recipient = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(name);
    try {
        const sendSmtpEmail = {
            sender: sender,
            to: recipient,
            subject: 'Welcome to FoodiNest',
            htmlContent: htmlContent,
            params: {
                company_info_name: "FoodiNest",
                name: name
            }
        };

        const res = await client.sendTransacEmail(sendSmtpEmail);
        console.log("Welcome email sent:", res);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const recipient = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
        const sendSmtpEmail = {
            sender: sender,
            to: recipient,
            subject: 'Reset your password',
            htmlContent: htmlContent,
            headers: { "category": "Reset Password" }
        };

        const res = await client.sendTransacEmail(sendSmtpEmail);
        console.log("Password reset email sent:", res);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to reset password");
    }
};

export const sendResetSuccessEmail = async (email: string) => {
    const recipient = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const sendSmtpEmail = {
            sender: sender,
            to: recipient,
            subject: 'Password Reset Successfully',
            htmlContent: htmlContent,
            headers: { "category": "Password Reset" }
        };

        const res = await client.sendTransacEmail(sendSmtpEmail);
        console.log("Password reset success email sent:", res);
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email");
    }
};
