import express from "express";
import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { addMenu, editMenu } from "../controller/menu.controller";

const router = express.Router();

// Route to add a menu item
router.route("/").post(isAuthenticated, upload.single("image"), addMenu);

// Route to update a menu item by ID
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu);

export default router;
