import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { validate,chatCompletionValidator } from "../utils/validators.js";
import { generateChatCompletion,sendChatToUser,deleteChats } from "../controllers/chat-controllers_groq.js";


const chatRoutes = Router();

chatRoutes.post("/new",validate(chatCompletionValidator),verifyToken,generateChatCompletion);
chatRoutes.get("/all-chats",verifyToken,sendChatToUser);
chatRoutes.get("/delete",verifyToken,deleteChats);

export default chatRoutes;
