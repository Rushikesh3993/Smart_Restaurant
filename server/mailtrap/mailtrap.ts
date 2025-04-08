const SibApiV3Sdk = require("sib-api-v3-sdk");
import dotenv from "dotenv";

dotenv.config();

// Initialize the API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key manually
const apiKey = new SibApiV3Sdk.ApiClient().authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || ""; 

export const client = apiInstance;

export const sender = {
  email: process.env.BREVO_SENDER_EMAIL || "default@example.com",
  name: process.env.BREVO_SENDER_NAME || "Default Sender",
};
