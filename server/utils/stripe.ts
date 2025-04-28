
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

type CartItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

export const createStripeSession = async (cartItems: CartItem[]) => {
  if (!cartItems.length) {
    throw new Error("Cart is empty.");
  }

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: item.price * 100, // convert ₹ to paisa
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
  });

  return session.url;
};
