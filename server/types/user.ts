import { Document, Types } from "mongoose";

export interface IUserDocument extends Document {
  _id: Types.ObjectId;  // ✅ Use ObjectId here
  fullname: string;
  email: string;
  password: string;
  contact: number;
  role: string;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  lastLogin?: Date;
}
