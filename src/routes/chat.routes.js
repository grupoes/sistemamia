import { Router } from "express";
import { chatView, addMessage, mensajes_numero, addMessageFirestore, numerosWhatsapp, traer_ultimo_mensaje, uploadImage } from "../controllers/chat.controller.js";

import corsMiddleware from "../middlewares/cors.js";

const router = Router();

router.use(corsMiddleware);

router.get('/chat', chatView);
router.post('/addMessageChat', addMessage);
router.get('/messageNumber/:id', mensajes_numero);
router.post('/messageFirestore', addMessageFirestore);
router.get('/numeroWhatsapp', numerosWhatsapp);
router.get('/ultimoMensaje/:id', traer_ultimo_mensaje);
router.post('/subir_imagen', uploadImage);

export default router;