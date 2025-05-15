// ✅ Imports
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";


// ✅ Stripe webhook handler
import { stripeWebhook } from "./controller/order.controller";

// ✅ Routes
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import chatbotRoute from "./routes/chatbot.route";
// import chatbotRoutes from "./routes/chatbot.routes"; // <-- ADD THIS


// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DIRNAME = path.resolve();

// ✅ Stripe webhook route must be added BEFORE express.json
app.post("/api/v1/order/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// ✅ Middleware setup (in correct order)
app.use(cookieParser()); // 🍪 Parse cookies
app.use(cors({
  origin: ["https://smart-restaurant-zdmu.onrender.com", "http://localhost:5174"], // Frontend URLs
  credentials: true                // Allow cookies
}));
app.use(express.json({ limit: "10mb" })); // Parse JSON
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded data

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/chatbot", chatbotRoute); // ← ✅ Add this line

// ✅ Serve frontend (Vite build)
app.use(express.static(path.join(DIRNAME, "/client/dist")));
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  connectDB(); // Connect to MongoDB
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
