/// <reference path="../sib-api-v3-sdk.d.ts" />
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY!;

export const client = new SibApiV3Sdk.TransactionalEmailsApi();

export const sender = {
  email: process.env.BREVO_SENDER_EMAIL || "rushikesh@foodinest.site",
  name: process.env.BREVO_SENDER_NAME || "FoodiNest",
};
