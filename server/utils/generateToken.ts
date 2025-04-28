import jwt from "jsonwebtoken";
// import { IUserDocument } from "../models/user.model";
import { IUserDocument } from "../types/user";

import { Response } from "express";

export const generateToken = (res: Response, user: IUserDocument) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },  // include role if needed
    process.env.SECRET_KEY!,
    { expiresIn: "1d" }
  );

  // Set cookie with more specific options to ensure it's properly stored
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/", // Ensure cookie is available for all paths
    domain: process.env.NODE_ENV === "production" ? process.env.DOMAIN : undefined // Set domain in production
  });

  console.log("✅ Token and cookie set for user:", user._id);
  return token;
};
