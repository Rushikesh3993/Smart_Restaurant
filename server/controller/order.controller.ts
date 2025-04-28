import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order, IOrder } from "../models/order.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);


type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number | string;
    quantity: number | string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    contact: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.id });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    if (!req.id) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId)
      .populate({ path: "menus", model: "Menu" });

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }

    const order = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
      totalAmount: checkoutSessionRequest.cartItems.reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseInt(item.price) : item.price;
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity;
        return total + (price * quantity * 100); // Convert to cents for Stripe
      }, 0)
    });

    const lineItems = createLineItems(checkoutSessionRequest, restaurant.menus);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.id.toString(),
      },
    });

    if (!session.url) {
      return res.status(400).json({ success: false, message: "Failed to create Stripe session" });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"] as string;
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;
    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch (error: any) {
    console.error("❌ Webhook verification failed:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const orderId = session.metadata?.orderId;
      const order = await Order.findById(orderId);
      if (!order) {
        console.error("Order not found for webhook");
        return res.status(404).send();
      }

      order.status = "pending";
      order.totalAmount = session.amount_total ?? 0;
      await order.save();

      console.log("✅ Order confirmed via webhook:", orderId);
    } catch (err) {
      console.error("Error handling webhook:", err);
      return res.status(500).send();
    }
  }

  res.status(200).send();
};

export const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: any
) => {
  return checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item: any) => item._id.toString() === cartItem.menuId
    );

    if (!menuItem) {
      throw new Error(`Menu item not found for ID: ${cartItem.menuId}`);
    }

    const quantity = typeof cartItem.quantity === "string"
      ? parseInt(cartItem.quantity)
      : cartItem.quantity;

    const price = typeof cartItem.price === "string"
      ? parseInt(cartItem.price)
      : cartItem.price;

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: menuItem.name,
          images: [menuItem.image],
        },
        unit_amount: price * 100,
      },
      quantity,
    };
  });
};
