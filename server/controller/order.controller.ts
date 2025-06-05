import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { Restaurant, IRestaurantDocument } from "../models/restaurant.model";
import { Order, IOrder } from "../models/order.model";
import Stripe from "stripe";
import { Menu, IMenu } from "../models/menu.model";
import mongoose from "mongoose";

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
    const orders = await Order.find({ user: req.id })
      .populate<{ restaurant: IRestaurantDocument }>({
        path: "restaurant",
        select: "restaurantName city country",
      })
      .populate<{ cartItems: { menuId: string; name: string; image: string; price: number; quantity: number }[] }>({
        path: "cartItems",
        select: "name price image quantity",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    if (!req.id) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    // Find the restaurant for each menu item in the cart
    let restaurant: IRestaurantDocument | null = null;
    if (checkoutSessionRequest.cartItems && checkoutSessionRequest.cartItems.length > 0) {
      const menuIds = checkoutSessionRequest.cartItems.map(item => item.menuId);
      console.log("🔍 Looking for restaurant with menuIds:", menuIds);
      const restaurants = await Restaurant.find({ menus: { $in: menuIds } });
      console.log("📦 Found restaurants:", restaurants.map(r => r._id));
      if (restaurants.length === 1) {
        restaurant = await Restaurant.findById(restaurants[0]._id).populate({ path: "menus", model: "Menu" }) as IRestaurantDocument | null;
        console.log("✅ Found restaurant:", restaurant?._id);
      } else {
        console.log("❌ Multiple or no restaurants found for menu items");
        return res.status(400).json({ success: false, message: "All items in cart must be from the same restaurant." });
      }
    }
    if (!restaurant && checkoutSessionRequest.restaurantId) {
      console.log("🔍 Looking for restaurant by ID:", checkoutSessionRequest.restaurantId);
      restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate({ path: "menus", model: "Menu" }) as IRestaurantDocument | null;
      console.log("✅ Found restaurant by ID:", restaurant?._id);
    }

    if (!restaurant) {
      console.log("❌ No restaurant found");
      return res.status(400).json({ success: false, message: "Could not determine the restaurant for this order." });
    }

    const order = new Order({
      restaurant: (restaurant as IRestaurantDocument)._id,
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

    const lineItems = createLineItems(checkoutSessionRequest, (restaurant as IRestaurantDocument).menus || []);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "GB", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/success?orderId=${order._id.toString()}`,
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
    console.log("Order saved. Order.restaurant:", order.restaurant);

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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

export const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: any
) => {
  return checkoutSessionRequest.cartItems.map((cartItem) => {
    // Find the menu item if it exists, otherwise use the cart item directly
    const menuItem = menuItems?.find(
      (item: any) => item._id.toString() === cartItem.menuId
    ) || cartItem;

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
          name: menuItem.name || cartItem.name,
          images: menuItem.image ? [menuItem.image] : [cartItem.image],
        },
        unit_amount: price * 100,
      },
      quantity,
    };
  });
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, restaurantId } = req.body;

    // Validate required fields
    if (!items || !totalAmount || !deliveryAddress || !paymentMethod || !restaurantId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create the order
    const order = new Order({
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      restaurant: restaurantId,
      status: "pending",
    });

    // Save the order
    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate<{ restaurant: IRestaurantDocument }>({
        path: "restaurant",
        select: "restaurantName city country",
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
};

export const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const orders = await Order.find({ restaurant: restaurantId })
      .populate<{ cartItems: { menuId: string; name: string; image: string; price: number; quantity: number }[] }>({
        path: "cartItems",
        select: "name price image quantity",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({ message: "Error fetching restaurant orders" });
  }
};
