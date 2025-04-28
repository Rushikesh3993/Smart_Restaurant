import express from "express";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantOrder,
  getSingleRestaurant,
  searchRestaurant,
  updateOrderStatus,
  updateRestaurant,
  getAllRestaurants,
  getSmartRestaurants, // ✅ import smart restaurant
} from "../controller/restaurant.controller"; // ✅ controllers (not controller)

import upload from "../middlewares/multer";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

// Create, Get, Update Restaurant (for authenticated user)
router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);

// Restaurant Orders
router.route("/order").get(isAuthenticated, getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);

// Search Restaurants
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);

// Smart Recommendations 🔥
router.route("/smart-restaurants").get(getSmartRestaurants);

// Get All Restaurants (for Home Page maybe)
router.route("/all").get(getAllRestaurants);

// Get Single Restaurant Details
router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;
