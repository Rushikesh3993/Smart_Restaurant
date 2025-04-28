// import { useState, useRef, useEffect } from "react";
// import { Send } from "lucide-react";
// import axios from "axios";
// import { motion } from "framer-motion";

// const Chatbot = () => {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
//   const [isBotTyping, setIsBotTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { from: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       setIsBotTyping(true);
//       const res = await axios.post("/api/v1/chatbot", { message: input });
//       const botMessage = { from: "bot", text: res.data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = { from: "bot", text: "Sorry, something went wrong." };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsBotTyping(false);
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isBotTyping]);

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {/* Glowing Chatbot Button */}
//       <motion.div
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setOpen(!open)}
//         className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
//       >
//         <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-50"></div>
//         <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-4 z-10">
//           <img src="/chatboot.png" alt="Chatbot" className="w-8 h-8" />
//         </div>
//       </motion.div>

//       {/* Chat Window */}
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-900 w-80 h-96 rounded-2xl shadow-2xl p-4 flex flex-col justify-between mt-4 border border-gray-200 dark:border-gray-700"
//         >
//           {/* Messages */}
//           <div className="overflow-y-auto flex-1 space-y-2 pr-2">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`p-2 rounded-lg text-sm max-w-[80%]
//                   ${msg.from === "user"
//                     ? "ml-auto bg-blue-100 dark:bg-blue-600 text-black dark:text-white text-right"
//                     : "mr-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-left"
//                   }
//                 `}
//               >
//                 {msg.text}
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isBotTyping && (
//               <div className="flex items-center gap-1 ml-2">
//                 <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
//                 <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-150"></span>
//                 <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-300"></span>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Box */}
//           <div className="flex mt-2">
//             <input
//               type="text"
//               className="flex-1 border rounded-l-xl p-2 text-sm outline-none bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask me anything..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") sendMessage();
//               }}
//             />
//             <button
//               onClick={sendMessage}
//               className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-r-xl text-white flex items-center justify-center"
//             >
//               <Send size={16} />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/useCartStore"; // Zustand cart

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const [stage, setStage] = useState<"start" | "viewingRestaurants" | "choosingFood" | "orderPlaced">("start");

  const sendSound = useRef<HTMLAudioElement | null>(null);
  const receiveSound = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cart = useCartStore((state) => state.cart);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    sendSound.current = new Audio("/sounds/send.wav");
    receiveSound.current = new Audio("/sounds/receive.wav");
  }, []);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const userMessage = { from: "user", text: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    sendSound.current?.play().catch(console.error);

    setIsBotTyping(true);

    setTimeout(async () => {
      try {
        // Special cart check
        if (messageToSend.toLowerCase().includes("cart")) {
          if (cart.length === 0) {
            setMessages((prev) => [...prev, { from: "bot", text: "🛒 Your cart is empty." }]);
          } else {
            const cartDetails = cart
              .map(item => `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`)
              .join("<br>");
            const cartMessage = `🛒 <strong>Your Cart:</strong><br>${cartDetails}<br><br><strong>Total: ₹${totalPrice}</strong>`;
            setMessages((prev) => [...prev, { from: "bot", text: cartMessage }]);
          }
          receiveSound.current?.play().catch(console.error);
          return;
        }

        const res = await axios.post("/api/v1/chatbot", { message: messageToSend });

        const botReply = res.data.reply || "Sorry, I didn't get that.";
        const botMessage = { from: "bot", text: botReply };

        setMessages((prev) => [...prev, botMessage]);
        receiveSound.current?.play().catch(console.error);

        // 💡 Smart stage detection
        if (botReply.toLowerCase().includes("restaurants")) {
          setStage("viewingRestaurants");
        } else if (botReply.toLowerCase().includes("menu")) {
          setStage("choosingFood");
        } else if (botReply.toLowerCase().includes("order placed") || botReply.toLowerCase().includes("order confirmed")) {
          setStage("orderPlaced");
        }
      } catch (error) {
        setMessages((prev) => [...prev, { from: "bot", text: "Sorry, something went wrong." }]);
      } finally {
        setIsBotTyping(false);
      }
    }, 1200);
  };

  const handleOpenChat = () => {
    setOpen(!open);

    if (!hasGreeted && !open) {
      setHasGreeted(true);
      setIsBotTyping(true);

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: "Hello! 👋 How can I assist you today?" }]);
        receiveSound.current?.play().catch(console.error);
        setIsBotTyping(false);
        setStage("start");
      }, 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const renderQuickOptions = () => {
    if (isBotTyping) return null;
  
    switch (stage) {
      case "start":
        return (
          <button
            onClick={() => sendMessage("Show me the restaurants 🍽️")}
            className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
          >
            🍽️ Show Restaurants
          </button>
        );
      case "viewingRestaurants":
        return (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => sendMessage("Show me the menu for Nation 11 📋")}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              📋 View Menu for Nation 11
            </button>
            <button
              onClick={() => sendMessage("Show me the menu for Hotel Bliss 📋")}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              📋 View Menu for Hotel Bliss
            </button>
          </div>
        );
      case "choosingFood":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => sendMessage("View my cart 🛒")}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              🛒 My Cart
            </button>
            <button
              onClick={() => sendMessage("Show me the menu again ➕")}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              ➕ Add More
            </button>
          </div>
        );
      case "orderPlaced":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => sendMessage("Track my order 📦")}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              📦 Track Order
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setStage("start");
                sendMessage("Start a new order 🛍️");
              }}
              className="bg-blue-100 dark:bg-blue-600 text-sm text-black dark:text-white rounded-full px-4 py-1"
            >
              🛍 New Order
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpenChat}
        className="relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-50"></div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-cyan-400 dark:to-blue-500 rounded-full p-4 z-10">
          <img src="/chatboot.png" alt="Chatbot" className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Chat Window */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-80 h-96 rounded-2xl shadow-2xl p-4 mt-4 flex flex-col justify-between bg-white dark:bg-gray-900 text-black dark:text-white"
        >
          {/* Messages */}
          <div className="overflow-y-auto flex-1 space-y-2 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-sm max-w-[80%]
                  ${msg.from === "user"
                    ? "bg-blue-100 dark:bg-blue-500 ml-auto text-right text-black dark:text-white"
                    : "bg-gray-200 dark:bg-gray-700 mr-auto text-left text-black dark:text-white"
                  }
                `}
              >
                {msg.from === "bot" ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            ))}

            {/* Typing animation */}
            {isBotTyping && (
              <div className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            {/* Quick Options */}
            <div className="flex flex-wrap gap-2 mt-2">
              {renderQuickOptions()}
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Ask me anything..."
              className="flex-1 p-2 rounded-l-xl text-sm border border-gray-300 dark:border-gray-600 outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <button
              onClick={() => sendMessage()}
              className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-cyan-400 dark:to-blue-500 rounded-r-xl text-white flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;




