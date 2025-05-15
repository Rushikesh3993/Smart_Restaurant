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

// import { Request, Response } from "express";
// import axios from "axios";
// import { Restaurant } from "../models/restaurant.model";
// import { Menu } from "../models/menu.model";
// import { createStripeSession } from "../utils/stripe";

// export const chatbotHandler = async (req: Request, res: Response) => {
//   const { message, cart } = req.body;
//   console.log("⚡ Received message:", message);

//   if (!message || typeof message !== "string") {
//     return res.status(400).json({ success: false, reply: "Message is required." });
//   }

//   try {
//     const lowerCaseMessage = message.toLowerCase().trim();

//     const askGemini = async (prompt: string) => {
//       const { data } = await axios.post(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//         { contents: [{ parts: [{ text: prompt }] }] }
//       );
//       return data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     };

//     // 🍽 Show all restaurants
//     if (lowerCaseMessage.includes("start") || lowerCaseMessage.includes("restaurants")) {
//       const restaurants = await Restaurant.find({});

//       if (!restaurants.length) {
//         return res.status(404).json({ success: false, reply: "No restaurants found in database." });
//       }

//       const reply = restaurants.map((r, idx) => `${idx + 1}. ${r.restaurantName} 📍 ${r.city}`).join("\n");

//       const buttons = restaurants.map((r) => ({
//         label: `📋 View Menu for ${r.restaurantName}`,
//         value: `show menu for ${r.restaurantName}`,  // Important for the next step
//       }));

//       return res.status(200).json({
//         success: true,
//         reply: `Here are our restaurants:\n\n${reply}`,
//         buttons,
//       });
//     }

//     // 📋 Show menu of a particular restaurant
//     if (lowerCaseMessage.includes("show menu for")) {
//       const restaurantName = message.replace(/show menu for/i, "").trim();

//       // 🔥 Find restaurant with flexible search (case-insensitive)
//       const restaurant = await Restaurant.findOne({
//         restaurantName: { $regex: new RegExp(restaurantName, "i") },
//       });

//       if (!restaurant) {
//         return res.status(404).json({
//           success: false,
//           reply: `❌ Restaurant "${restaurantName}" not found. Please choose a valid one.`,
//         });
//       }

//       // 🔥 Find menus that belong to this restaurant
//       const menus = await Menu.find({ restaurantId: restaurant._id });

//       if (!menus.length) {
//         return res.status(404).json({
//           success: false,
//           reply: `📋 No menu found for "${restaurant.restaurantName}".`,
//         });
//       }

//       // 🧠 Create list of menu items
//       const menuList = menus
//         .map((menu, idx) => `${idx + 1}. ${menu.name} (₹${menu.price})`)
//         .join("\n");

//       const smartPrompt = `
//     You are a helpful food assistant.
//     Here is the menu for "${restaurant.restaurantName}":

//     ${menuList}

//     Suggest 2-3 popular dishes from above and describe them in friendly way (2-3 lines each).
//       `.trim();

//       const smartReply = (await askGemini(smartPrompt)) || `Here’s the menu for ${restaurant.restaurantName}:\n${menuList}`;

//       const buttons = [
//         { label: "🛒 My Cart", value: "show cart" },
//         { label: "➕ Add More", value: "start" },
//       ];

//       return res.status(200).json({
//         success: true,
//         reply: smartReply,
//         buttons,
//       });
//     }


//     // 🛒 View Cart
//     if (lowerCaseMessage.includes("cart") || lowerCaseMessage.includes("my cart")) {
//       if (!cart || !Array.isArray(cart) || cart.length === 0) {
//         return res.status(200).json({ success: true, reply: "🛒 Your cart is currently empty." });
//       }

//       const cartDetails = cart
//         .map((item: any, idx: number) => `${idx + 1}. ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`)
//         .join("\n");

//       const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

//       const sessionUrl = await createStripeSession(cart);

//       const reply = `
// 🛒 Here’s your cart:\n\n${cartDetails}\n\nTotal: ₹${total}
// <br/><br/>
// <a href="${sessionUrl}" target="_blank" style="
//   background-color: #4CAF50;
//   color: white;
//   padding: 12px 20px;
//   text-align: center;
//   text-decoration: none;
//   display: inline-block;
//   border-radius: 8px;
//   font-size: 16px;
// ">
//   💳 Pay Now
// </a>
//       `.trim();

//       const buttons = [
//         { label: "➕ Add More", value: "start" },
//       ];

//       return res.status(200).json({ success: true, reply, buttons });
//     }

//     // 📦 Track Order
//     if (lowerCaseMessage.includes("track")) {
//       const buttons = [
//         { label: "🛍 New Order", value: "start" },
//       ];

//       return res.status(200).json({
//         success: true,
//         reply: "📦 Your order is being prepared! Estimated delivery: 30 minutes.",
//         buttons,
//       });
//     }

//     // 🛍️ Start New Order
//     if (lowerCaseMessage.includes("new order") || lowerCaseMessage.includes("order") || lowerCaseMessage.includes("book")) {
//       const buttons = [
//         { label: "🍽 Show Restaurants", value: "start" },
//       ];

//       return res.status(200).json({
//         success: true,
//         reply: "🛍️ Sure! Let's start a new order. Choose a restaurant to begin!",
//         buttons,
//       });
//     }

//     // 🤖 Fallback response
//     const fallbackPrompt = `
// You are FoodiNestBot 🍽️, a friendly chatbot for FoodiNest.
// Help customers with food orders, restaurant details, menu recommendations, cart view, and payments.

// User Message: "${message}"

// Respond in a friendly and helpful way.
//     `.trim();

//     const fallbackReply = (await askGemini(fallbackPrompt)) || "Sorry, I didn't understand that.";

//     const fallbackButtons = [
//       { label: "🍽 Show Restaurants", value: "start" },
//     ];

//     return res.status(200).json({ success: true, reply: fallbackReply, buttons: fallbackButtons });

//   } catch (error: any) {
//     console.error("🔥 Chatbot Error:", error?.response?.data || error.message);
//     return res.status(500).json({ success: false, reply: "Internal server error. Please try again later." });
//   }
// };

// server/controller/chatbot.controller.ts
// backend/controllers/chatbot.controller.ts
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Restaurant } from "../models/restaurant.model";
import { Menu } from "../models/menu.model";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const chatbotController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const lowerCaseMessage = message.toLowerCase();

    // 1. Handle greetings manually
    if (["hi", "hello", "hey"].some(greet => lowerCaseMessage.includes(greet))) {
      return res.json({ role: "bot", text: "Hi! Welcome to FoodiNest. How can I assist you today? 🍽️" });
    }

    // 2. Show Restaurants
    if (/restaurant|restaurants|show.*restaurant|list.*restaurant/.test(lowerCaseMessage)) {
      const restaurants = await Restaurant.find();
      if (!restaurants.length) {
        return res.json({ role: "bot", text: "Sorry, no restaurants found right now." });
      }
      
      const restaurantList = restaurants.map(r => 
        `🍽️ ${r.restaurantName} - ${Array.isArray(r.cuisines) ? r.cuisines.join(", ") : r.cuisines}`
      ).join("\n");
    
      return res.json({ role: "bot", text: `Here are some restaurants:\n\n${restaurantList}` });
    }
    
    
    // 3. Show Menu
    if (lowerCaseMessage.includes("menu")) {
      const menus = await Menu.find();
      if (!menus.length) {
        return res.json({ role: "bot", text: "Sorry, no menu items available right now." });
      }
      const menuList = menus.map(m => `${m.name} (₹${m.price})`).join("\n");
      return res.json({ role: "bot", text: `Here’s the menu:\n\n${menuList}` });
    }

    // 4. Order item
    if (lowerCaseMessage.includes("order") || lowerCaseMessage.includes("i want")) {
      const menus = await Menu.find();
      const foundItem = menus.find(m => lowerCaseMessage.includes(m.name.toLowerCase()));
      if (foundItem) {
        return res.json({
          role: "bot",
          text: `${foundItem.name} (₹${foundItem.price}) added to your cart. 🛒 Anything else?`,
          cartItemToAdd: {
            _id: foundItem._id,
            name: foundItem.name,
            description: foundItem.description,
            price: foundItem.price,
            image: foundItem.image,
          }
        });
      } else {
        return res.json({ role: "bot", text: "Sorry, I couldn't find that item. Could you try again?" });
      }
    }

    // 5. Fallback: Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = await model.startChat({ history: [] });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === "") {
      return res.json({ role: "bot", text: "Sorry, I didn't understand that. Could you rephrase?" });
    }

    return res.json({ role: "bot", text: text });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};










