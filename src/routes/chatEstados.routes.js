import { Router } from "express";

import { addChatEstados } from "../controllers/estadosConversacion.controller.js";
import { addWhatsapp } from "../controllers/whatsapp.controller.js";

import corsMiddleware from "../middlewares/cors.js";

const router = Router();

router.use(corsMiddleware);

router.post('/addEstados', addChatEstados);
router.post('/addWhatsapp', addWhatsapp);

export default router;