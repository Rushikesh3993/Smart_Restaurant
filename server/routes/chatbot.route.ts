// import express from "express";
// import { chatWithGemini } from "../controller/chatbot.controller"; // ✅ match export name

// const router = express.Router();

// router.post("/", chatWithGemini); // ✅ correct function name

// export default router;
import { Router } from "express";
import { chatbotController } from "../controller/chatbot.controller";

const router = Router();

router.post("/chat", chatbotController);

export default router;


