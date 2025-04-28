import mongoose, { Document, Model, Types } from "mongoose"; // ✅ Import Types

export interface IUser {
  fullname: string;
  email: string;
  password: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  role: string; // ✅ Not optional anymore
  lastLogin?: Date;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
}


export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId; // ✅ Make sure this is explicitly here
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact: { type: Number, required: true },
  address: { type: String, default: "Update your address" },
  city: { type: String, default: "Update your city" },
  country: { type: String, default: "Update your country" },
  profilePicture: { type: String, default: "" },
  role: { type: String, default: "user" },
  lastLogin: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordTokenExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);

// Add virtual field for restaurant
userSchema.virtual('restaurant', {
  ref: 'Restaurant',
  localField: '_id',
  foreignField: 'user',
  justOne: true
});

// Enable virtuals in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
