import { Router } from "express";
import { chatView, addMessage, mensajes_numero, addMessageFirestore, numerosWhatsapp, traer_ultimo_mensaje, uploadImage, asignarClienteAUnTrabajador, insertChat, uploadAudio, audioMiddleware, getEmbudoEtiqueta, getEtiquetaEmbudo, actualizarEtiqueta, enviar_mensaje_icono_whatsapp, socketMensaje, getEmpleadosAsignar, asignarAsistente } from "../controllers/chat.controller.js";

import { getAgenteId } from "../controllers/base.controller.js";

import corsMiddleware from "../middlewares/cors.js";

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.use(corsMiddleware);

router.get('/chat', chatView);
router.post('/addMessageChat', addMessage);
router.get('/messageNumber/:id', mensajes_numero);
router.post('/messageFirestore', addMessageFirestore);
router.get('/numeroWhatsapp', checkAuth, numerosWhatsapp);
router.get('/ultimoMensaje/:id', traer_ultimo_mensaje);
router.post('/subir_imagen', uploadImage);
router.post('/actualizarEtiqueta', actualizarEtiqueta);
router.get('/welcome/:id', asignarClienteAUnTrabajador);
router.post('/insertChat', insertChat);
router.post('/uploadAudio', audioMiddleware, uploadAudio);
router.get('/getEmbudoEtiqueta/:id', getEmbudoEtiqueta);
router.get('/getEtiquetaEmbudo/:id', getEtiquetaEmbudo);
router.post('/sendMensajeWhatsapp', enviar_mensaje_icono_whatsapp);
router.get('/socketMensaje/:id', socketMensaje);
router.get('/getEmpleadosAsignar', getEmpleadosAsignar);
router.post('/asignarAsistente', asignarAsistente);

router.get('/getAgentes', checkAuth,getAgenteId);

export default router;