// import { Request, Response } from "express";
// import { Restaurant } from "../models/restaurant.model"; // ✅ Confirm this path

// export const chatWithGemini = async (req: Request, res: Response) => {
//   const { message } = req.body;
//   const lowerMsg = message.toLowerCase();

//   try {
//     // Step 1: Show restaurant list
//     if (lowerMsg.includes("restaurant") || lowerMsg.includes("show")) {
//       const restaurants = await Restaurant.find().populate("menus");

//       if (!restaurants.length) {
//         return res.json({ reply: "😔 No restaurants found in our database." });
//       }

//       const reply = restaurants
//         .map(r => `🍽️ ${r.restaurantName} (${r.city}, ${r.country}) - ${r.menus?.length || 0} menu items`)
//         .join("\n");

//       return res.json({ reply });
//     }

//     // Fallback
//     return res.json({ reply: "🤖 Sorry, I didn’t understand that. Try asking something like 'Show me restaurants'!" });
//   } catch (error) {
//     console.error("❌ Error in chatbot controller:", error);
//     return res.status(500).json({ reply: "Internal server error" });
//   }
// };

// import { Request, Response } from "express";
// import axios from "axios";

// export const chatbotHandler = async (req: Request, res: Response) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ success: false, message: "Message is required" });
//   }

//   try {
//     const prompt = `
// You are a friendly restaurant assistant chatbot named FoodiNestBot 🍽️.
// Help users with:
// - Restaurant recommendations
// - Menu item suggestions
// - Placing an order

// If a user says "order" or "book", politely ask for item name and quantity.
// Keep responses short and helpful.

// User Message: "${message}"
//     `;

//     const geminiResponse = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       }
//     );

//     const botReply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";

//     return res.status(200).json({ success: true, reply: botReply });

//   } catch (error: any) {
//     console.error("Chatbot Error:", error?.response?.data || error.message);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// import { Request, Response } from "express";
// import axios from "axios";
// import { Restaurant } from "../models/restaurant.model";
// import { Menu } from "../models/menu.model"; // Make sure you have this model

// export const chatbotHandler = async (req: Request, res: Response) => {
//   const { message } = req.body;
//   console.log("⚡ Received message:", message);

//   if (!message || typeof message !== "string") {
//     return res.status(400).json({ success: false, reply: "Message is required" });
//   }

//   try {
//     const lowerCaseMessage = message.toLowerCase().trim();

//     // 🏠 Show Restaurants
//     if (lowerCaseMessage.includes("restaurant") || lowerCaseMessage.includes("restaurants") || lowerCaseMessage.includes("show restaurants")) {
//       const restaurants = await Restaurant.find({});
//       if (restaurants.length === 0) {
//         return res.status(200).json({ success: true, reply: "No restaurants available right now. 🍽️" });
//       }

//       const reply = restaurants
//         .map((r, idx) => `${idx + 1}. ${r.restaurantName} 📍 ${r.city}`)
//         .join("\n");

//       return res.status(200).json({ success: true, reply: `Here are our restaurants:\n\n${reply}` });
//     }

//     // 📋 Show Menu
//     if (lowerCaseMessage.includes("menu")) {
//       const menus = await Menu.find({}); // you can filter by restaurantId if needed

//       if (menus.length === 0) {
//         return res.status(200).json({ success: true, reply: "No menu items available currently. 📋" });
//       }

//       const reply = menus
//         .map((m, idx) => `${idx + 1}. ${m.name} - ₹${m.price}`)
//         .join("\n");

//       return res.status(200).json({ success: true, reply: `Here’s our menu:\n\n${reply}` });
//     }

//     // 🛒 Cart Info (static for now)
//     if (lowerCaseMessage.includes("cart") || lowerCaseMessage.includes("view my cart")) {
//       return res.status(200).json({ success: true, reply: "🛒 Your cart has 2 items. Total: ₹499" });
//     }

//     // 🚚 Track Order
//     if (lowerCaseMessage.includes("track") || lowerCaseMessage.includes("track my order")) {
//       return res.status(200).json({ success: true, reply: "📦 Your order is being prepared! Estimated delivery: 30 minutes." });
//     }

//     // 🤖 Otherwise use Gemini AI for fallback conversation
//     const prompt = `
// You are a friendly AI chatbot named FoodiNestBot 🍽️ for a food delivery platform.
// You can:
// - Suggest restaurants
// - Suggest food menu items
// - Help users place orders
// - Track orders
// Keep replies short, friendly, and helpful.

// If a user mentions "order" or "book", ask politely for the item name and quantity.

// User's Message: "${message}"
//     `;

//     const geminiRes = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }]
//       }
//     );

//     const botReply = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand.";
//     return res.status(200).json({ success: true, reply: botReply });

//   } catch (error: any) {
//     console.error("🔥 Chatbot Error:", error?.response?.data || error.message);
//     return res.status(500).json({ success: false, reply: "Internal server error. Please try again later." });
//   }
// };
import { Request, Response } from "express";
import axios from "axios";
import { Restaurant } from "../models/restaurant.model";
import { Menu } from "../models/menu.model";
import { createStripeSession } from "../utils/stripe";

export const chatbotHandler = async (req: Request, res: Response) => {
  const { message, cart } = req.body;
  console.log("⚡ Received message:", message);

  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, reply: "Message is required." });
  }

  try {
    const lowerCaseMessage = message.toLowerCase().trim();

    const askGemini = async (prompt: string) => {
      const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      return data?.candidates?.[0]?.content?.parts?.[0]?.text;
    };

    // 🏠 Restaurants
    if (lowerCaseMessage.includes("restaurant") || lowerCaseMessage.includes("restaurants")) {
      const restaurants = await Restaurant.find({});
      if (!restaurants.length) {
        return res.status(200).json({ success: true, reply: "No restaurants available right now. 🍽️" });
      }

      const reply = restaurants.map((r, idx) => `${idx + 1}. ${r.restaurantName} 📍 ${r.city}`).join("\n");

      // Generate buttons dynamically
      const buttons = restaurants.map((r) => ({
        label: `📋 View Menu for ${r.restaurantName}`,
        value: `Show me the menu for ${r.restaurantName}`,
      }));

      return res.status(200).json({ success: true, reply: `Here are our restaurants:\n\n${reply}`, buttons });
    }

    // 📋 Menu or Recommendation
    if (lowerCaseMessage.includes("menu") || lowerCaseMessage.includes("recommend") || lowerCaseMessage.includes("suggest")) {
      const menus = await Menu.find({});
      if (!menus.length) {
        return res.status(200).json({ success: true, reply: "No menu items available currently. 📋" });
      }

      const menuList = menus.map((m) => `${m.name} (₹${m.price})`).join(", ");

      const smartPrompt = `
You are a food expert helping customers choose dishes.
Here are the available menu items: ${menuList}.
Based on that, suggest some popular or must-try dishes with 2-3 lines of description. Make it friendly!
      `.trim();

      const smartReply = (await askGemini(smartPrompt)) || `Here are some dishes:\n${menuList}`;

      return res.status(200).json({ success: true, reply: smartReply });
    }

    // 🛒 Show Cart
    if (lowerCaseMessage.includes("cart")) {
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(200).json({ success: true, reply: "🛒 Your cart is currently empty." });
      }

      const cartDetails = cart
        .map((item: any, idx: number) => `${idx + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`)
        .join("\n");

      const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      const reply = `🛒 Here’s your cart:\n\n${cartDetails}\n\nTotal: ₹${total}`;

      const buttons = [
        {
          label: "💳 Proceed to Pay",
          value: "pay",
        },
      ];

      return res.status(200).json({ success: true, reply, buttons });
    }

    // 🚚 Track Order
    if (lowerCaseMessage.includes("track")) {
      return res.status(200).json({ success: true, reply: "📦 Your order is being prepared! Estimated delivery: 30 minutes." });
    }

    // 🛍️ Place an Order
    if (lowerCaseMessage.includes("order") || lowerCaseMessage.includes("book")) {
      return res.status(200).json({ success: true, reply: "🛍️ Sure! Please tell me the dish name and quantity you want to order." });
    }

    // 💳 Payment
    if (lowerCaseMessage.includes("pay") || lowerCaseMessage.includes("payment")) {
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(200).json({ success: true, reply: "🛒 Your cart is empty. Add items before proceeding to payment." });
      }

      const sessionUrl = await createStripeSession(cart);

      const paymentButton = `
        🛒 Your cart is ready!
        <br/><br/>
        <a href="${sessionUrl}" target="_blank" style="
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          border-radius: 8px;
          font-size: 16px;
        ">
          💳 Pay Now
        </a>
      `;

      return res.status(200).json({ success: true, reply: paymentButton });
    }

    // 🤖 Fallback
    const fallbackPrompt = `
You are FoodiNestBot 🍽️, a friendly chatbot for FoodiNest.
You help customers with food orders, restaurant details, menu recommendations, cart view, and payments.

User Message: "${message}"

Respond in a friendly and helpful way.
    `.trim();

    const fallbackReply = (await askGemini(fallbackPrompt)) || "Sorry, I didn't understand that.";

    const fallbackButtons = [
      { label: "🏠 View Restaurants", value: "show restaurants" },
      { label: "📋 View Menu", value: "show menu" },
      { label: "🛒 View Cart", value: "show cart" },
    ];

    return res.status(200).json({ success: true, reply: fallbackReply, buttons: fallbackButtons });

  } catch (error: any) {
    console.error("🔥 Chatbot Error:", error?.response?.data || error.message);
    return res.status(500).json({ success: false, reply: "Internal server error. Please try again later." });
  }
};







