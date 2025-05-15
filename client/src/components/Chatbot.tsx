//  import { useState, useRef, useEffect } from "react";
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

// import { useState, useRef, useEffect, useMemo } from "react";
// import { Send, X, Bot } from "lucide-react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// type Message = {
//   role: "user" | "bot";
//   text: string;
// };

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputMessage, setInputMessage] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [retryMessage, setRetryMessage] = useState<string | null>(null);

//   const inputRef = useRef<HTMLInputElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const sendSound = useMemo(() => (typeof Audio !== "undefined" ? new Audio("/sounds/send.wav") : null), []);
//   const receiveSound = useMemo(() => (typeof Audio !== "undefined" ? new Audio("/sounds/receive.wav") : null), []);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour >= 5 && hour < 12) return "Good morning! 🌞";
//     if (hour >= 12 && hour < 18) return "Good afternoon! ☀️";
//     return "Good evening! 🌙";
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, isTyping]);

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       const greetingMessage: Message = {
//         role: "bot",
//         text: `Hi there! ${getGreeting()} Welcome to FoodiNest! What can I help you with today? 😊`,
//       };
//       setMessages([greetingMessage]);
//     }
//     if (isOpen) {
//       setTimeout(() => {
//         inputRef.current?.focus();
//       }, 300);
//     }
//   }, [isOpen, messages.length]);
//   const handleSend = async (messageToSend?: string) => {
//     const message = messageToSend ?? inputMessage.trim();
//     if (!message) return;
  
//     const updatedMessages: Message[] = [...messages, { role: "user", text: message }];
//     setMessages(updatedMessages);
//     sendSound?.play();
//     setInputMessage("");
//     setIsTyping(true);
//     setRetryMessage(null);
  
//     try {
//       const response = await axios.post("/api/v1/chatbot/chat", { message });
//       console.log("Response from server:", response.data);
//       const { text } = response.data; // ✅ Pick 'text' not 'reply'
  
//       setTimeout(() => {
//         setMessages((prev) => [...prev, { role: "bot", text }]);
//         receiveSound?.play();
//         setIsTyping(false);
//       }, 1200);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setRetryMessage(message);
//       setMessages((prev) => [
//         ...prev,
//         { role: "bot", text: "Sorry, something went wrong! Retrying..." },
//       ]);
//       setIsTyping(false);
  
//       setTimeout(() => {
//         if (retryMessage) {
//           handleSend(retryMessage);
//         }
//       }, 2000);
//     }
//   };
  
//   const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <AnimatePresence>
//         {!isOpen ? (
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1, y: [0, -6, 0] }}
//             exit={{ scale: 0 }}
//             transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
//             onClick={() => setIsOpen(true)}
//             className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 p-6 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center"
//           >
//             <Bot size={36} className="text-white" />
//           </motion.button>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.3 }}
//             className="w-80 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 text-white px-4 py-3 flex justify-between items-center">
//               <h1 className="font-bold text-lg">FoodiNest Chatbot 🤖</h1>
//               <button onClick={() => setIsOpen(false)} className="text-white">
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-800">
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`p-3 rounded-2xl max-w-[80%] text-sm ${
//                     msg.role === "user"
//                       ? "ml-auto bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-800 dark:to-violet-800 text-right"
//                       : "mr-auto bg-white dark:bg-gray-700 border dark:border-gray-600 shadow"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="mr-auto p-3 rounded-2xl bg-white dark:bg-gray-700 border dark:border-gray-600 shadow max-w-[60%] text-sm text-gray-500 italic flex items-center space-x-1">
//                   <span className="animate-bounce">⏳</span>
//                   <span>Bot is typing...</span>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white"
//                 placeholder="Type your message..."
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyDown={handleInputKeyDown}
//               />
//               <button
//                 onClick={() => handleSend()}
//                 className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 p-2 rounded-full text-white flex items-center justify-center"
//               >
//                 <Send size={18} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// /"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, X, Bot } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useMenuStore } from "@/store/useMenuStore";
import { CartItem } from "@/types/cartType";

type Message = {
  role: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addToCart, removeFromTheCart, cart } = useCartStore();
  const { menu } = useMenuStore();

  const sendSound = useMemo(() => (typeof Audio !== "undefined" ? new Audio("/sounds/send.wav") : null), []);
  const receiveSound = useMemo(() => (typeof Audio !== "undefined" ? new Audio("/sounds/receive.wav") : null), []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning! 🌞";
    if (hour >= 12 && hour < 18) return "Good afternoon! ☀️";
    return "Good evening! 🌙";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: Message = {
        role: "bot",
        text: `Hi there! ${getGreeting()} Welcome to FoodiNest! What can I help you with today? 😊`,
      };
      setMessages([greetingMessage]);
    }
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages.length]);

  const handleBotSpecialResponse = (botText: string) => {
    if (botText.includes("added to your cart")) {
      const match = botText.match(/(.*) \((₹\d+)\) added/);
      if (match) {
        const itemName = match[1].trim();
        const itemPrice = Number(match[2].replace(/[₹]/g, ""));
  
        const foundItem = menu.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
  
        if (foundItem) {
          const cartItem: CartItem = { 
            ...foundItem,
            quantity: 1, // ✅ add quantity properly
            restaurantId: foundItem.restaurantId || "", // safe fallback
          };
          addToCart(cartItem);
        } else {
          const fallbackCartItem: CartItem = {
            id: Date.now().toString(),
            _id: Date.now().toString(),
            name: itemName,
            description: "Delicious item from FoodiNest",
            price: itemPrice,
            image: "",
            restaurantId: "",
            quantity: 1,
          };
          addToCart(fallbackCartItem);
        }
      }
    }
  };
  

  const handleSend = async (messageToSend?: string) => {
    const message = messageToSend ?? inputMessage.trim();
    if (!message) return;

    const updatedMessages: Message[] = [...messages, { role: "user", text: message }];
    setMessages(updatedMessages);
    sendSound?.play();
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post("/api/v1/chatbot/chat", { message });
      const { text } = response.data;

      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", text }]);
        handleBotSpecialResponse(text);
        receiveSound?.play();
        setIsTyping(false);
      }, 1200);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, something went wrong. Please try again!" }]);
      setIsTyping(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromTheCart(itemId);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "✅ Item removed from your cart." },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -6, 0] }}
            exit={{ scale: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 p-6 rounded-full shadow-xl hover:scale-110 transition-all flex items-center justify-center"
          >
            <Bot size={36} className="text-white" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-80 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 text-white px-4 py-3 flex justify-between items-center">
              <h1 className="font-bold text-lg">FoodiNest Chatbot 🤖</h1>
              <button onClick={() => setIsOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-800 dark:to-violet-800 text-right"
                      : "mr-auto bg-white dark:bg-gray-700 border dark:border-gray-600 shadow"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {/* Cart Items with remove button */}
              {cart.length > 0 && (
                <div className="mr-auto p-3 rounded-2xl bg-white dark:bg-gray-700 border dark:border-gray-600 shadow max-w-[90%] text-sm space-y-2 mt-2">
                  <h2 className="font-bold mb-2">🛒 Cart Items:</h2>
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded p-2">
                      <span>{item.name}</span>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isTyping && (
                <div className="mr-auto p-3 rounded-2xl bg-white dark:bg-gray-700 border dark:border-gray-600 shadow max-w-[60%] text-sm text-gray-500 italic flex items-center space-x-1">
                  <span className="animate-bounce">⏳</span>
                  <span>Bot is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 dark:bg-gray-800 dark:border-gray-700 text-black dark:text-white"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
              />
              <button
                onClick={() => handleSend()}
                className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 p-2 rounded-full text-white flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
















