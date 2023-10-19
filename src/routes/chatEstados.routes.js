import { Router } from "express";

import { addChatEstados } from "../controllers/estadosConversacion.controller.js";
import { addWhatsapp, addContact, getContacts } from "../controllers/whatsapp.controller.js";

import corsMiddleware from "../middlewares/cors.js";

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.use(corsMiddleware);

router.post('/addEstados', addChatEstados);
router.post('/addWhatsapp', addWhatsapp);
router.post('/addContact', checkAuth, addContact);
router.post('/getContacts', checkAuth, getContacts);

export default router;