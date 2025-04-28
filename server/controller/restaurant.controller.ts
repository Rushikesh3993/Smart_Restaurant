import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import mongoose from "mongoose"; // ✅ added for random aggregate

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        const restaurant = await Restaurant.findOne({ user: req.id });
        if (restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant already exists for this user"
            });
        }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines).map((cuisine: string) => cuisine.trim()),
            imageUrl
        });

        await User.findByIdAndUpdate(req.id, { role: "restaurant_owner" });

        return res.status(201).json({
            success: true,
            message: "Restaurant Added"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id })
            .populate("menus")
            .populate({
                path: "user",
                select: "fullname email contact role isVerified"
            });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines).map((cuisine: string) => cuisine.trim());

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getRestaurantOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user');
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "")
            .split(",")
            .filter((cuisine) => cuisine);

        const query: any = {};
        const searchConditions: any[] = [];

        if (searchText) {
            searchConditions.push(
                { restaurantName: { $regex: searchText, $options: "i" } },
                { city: { $regex: searchText, $options: "i" } },
                { country: { $regex: searchText, $options: "i" } }
            );
        }

        if (searchQuery) {
            searchConditions.push(
                { restaurantName: { $regex: searchQuery, $options: "i" } },
                { cuisines: { $regex: searchQuery, $options: "i" } }
            );
        }

        if (searchConditions.length > 0) {
            query.$or = searchConditions;
        }

        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines };
        }

        const restaurants = await Restaurant.find(query).populate({
            path: "user",
            select: "fullname email contact role isVerified"
        });
        return res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getSingleRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find({}).populate({
            path: "user",
            select: "fullname email contact role isVerified"
        });
        return res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ ✅ ✅ Smart Recommendation Added
export const getSmartRestaurants = async (req: Request, res: Response) => {
    const { type, page = 1, location } = req.query;
    const limit = 5;

    try {
        let query: any = {};

        if (location) {
            query.city = { $regex: location, $options: "i" };
        }

        let restaurants;

        if (type === "random") {
            restaurants = await Restaurant.aggregate([
                { $match: query },
                { $sample: { size: limit } }
            ]);
        } else if (type === "top") {
            restaurants = await Restaurant.find(query).sort({ rating: -1 }).limit(limit);
        } else {
            restaurants = await Restaurant.find(query)
                .skip((+page - 1) * limit)
                .limit(limit);
        }

        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No restaurants found!"
            });
        }

        return res.status(200).json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
