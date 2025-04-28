import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

// Function to add a new menu
export const addMenu = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const file = req.file;

        // Ensure that the image file is present
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        // Upload the image to Cloudinary
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);

        // Create the new menu item in the database
        const menu = await Menu.create({
            name,
            description,
            price,
            image: imageUrl
        });

        // Find the restaurant and add the new menu to the restaurant's menus array
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
            // Explicitly cast menu._id as mongoose.Schema.Types.ObjectId
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id as mongoose.Schema.Types.ObjectId);
            await restaurant.save();
        }

        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Function to edit an existing menu
export const editMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Menu ID from URL params
        const { name, description, price } = req.body; // Fields to update
        const file = req.file; // New file if present

        // Find the menu by its ID
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found!"
            });
        }

        // Update the menu fields if they are provided
        if (name) menu.name = name;
        if (description) menu.description = description;
        if (price) menu.price = price;

        // If there's a new image, upload it and update the menu's image field
        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }

        // Save the updated menu
        await menu.save();

        return res.status(200).json({
            success: true,
            message: "Menu updated successfully",
            menu
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
