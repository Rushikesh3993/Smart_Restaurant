import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  createCheckoutSession,
  getOrders,
  stripeWebhook,
} from "../controller/order.controller";

const router = express.Router();

// ✅ Get all orders (needs auth)
router.route("/").get(isAuthenticated, getOrders);

// ✅ Create Stripe checkout session (needs auth)
router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

// ✅ Stripe webhook (raw body needed)
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);

export default router;
