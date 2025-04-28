import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
      role?: string; // 👈 Add role to request type
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🔐 isAuthenticated middleware triggered");
    console.log("Token from cookies:", req.cookies.token);

    const token = req.cookies?.token;

    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({
        success: false,
        message: "User not authenticated - token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      console.log("❌ Token verification failed or missing userId");
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ✅ Attach decoded data to request
    req.id = decoded.userId;
    req.role = decoded.role;

    console.log("✅ Token verified. User ID:", decoded.userId, "Role:", decoded.role);
    next();
  } catch (error) {
    console.error("🔥 Error in isAuthenticated middleware:", error);
    return res.status(500).json({
      message: "Internal server error during authentication",
    });
  }
};
