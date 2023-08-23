import { Router } from "express";
import { chatView, addMessage, mensajes_numero, addMessageFirestore, numerosWhatsapp, traer_ultimo_mensaje } from "../controllers/chat.controller.js";

const router = Router();

router.get('/chat', chatView);
router.post('/addMessageChat', addMessage);
router.get('/messageNumber/:id', mensajes_numero);
router.post('/messageFirestore', addMessageFirestore);
router.get('/numeroWhatsapp', numerosWhatsapp);
router.get('/ultimoMensaje/:id', traer_ultimo_mensaje);

export default router;