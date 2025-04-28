import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail, makeAdmin } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post((req, res, next) => {
    console.log("📨 Route /forgot-password triggered"); 
    next();
  }, forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/profile/update").put(isAuthenticated,updateProfile);
router.route("/make-admin").post(isAuthenticated, makeAdmin);

export default router;