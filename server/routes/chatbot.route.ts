// import express from "express";
// import { chatWithGemini } from "../controller/chatbot.controller"; // ✅ match export name

// const router = express.Router();

// router.post("/", chatWithGemini); // ✅ correct function name

// export default router;


import express from "express";
import { chatbotHandler } from "../controller/chatbot.controller";

const router = express.Router();

// POST /api/chatbot
router.post("/", chatbotHandler);

export default router;
