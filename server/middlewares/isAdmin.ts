// import { NextFunction, Request, Response } from "express";
// import { User } from "../models/user.model"; // Ensure correct path

// export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = req.id; // This is set by the isAuthenticated middleware

//         // Find the user by ID and check if the user is an admin
//         const user = await User.findById(userId);

//         if (!user || user.role !== "admin") {  // Check if role is 'admin'
//             return res.status(403).json({
//                 success: false,
//                 message: "Forbidden: You do not have admin rights"
//             });
//         }

//         // Allow access to the next middleware if the user is an admin
//         next();
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };
