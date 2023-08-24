import { Router } from "express";

import { addChatEstados } from "../controllers/estadosConversacion.controller.js";

import corsMiddleware from "../middlewares/cors.js";

const router = Router();

router.use(corsMiddleware);

router.post('/addEstados', addChatEstados);

export default router;