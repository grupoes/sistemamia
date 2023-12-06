import { Router } from "express";
import { chatView, mensajes_numero, addMessageFirestore, numerosWhatsapp, traer_ultimo_mensaje, uploadImage, asignarClienteAUnTrabajador, insertChat, uploadAudio, audioMiddleware, getEmbudoEtiqueta, getEtiquetaEmbudo, actualizarEtiqueta, enviar_mensaje_icono_whatsapp, socketMensaje, getEmpleadosAsignar, asignarAsistente, chatOne, getChatCodigo, contactosNoContestados, uploadImagePaste, envio_formulario_panel } from "../controllers/chat.controller.js";

import { getAgenteId, asignarAsistenteDataJson } from "../controllers/base.controller.js";

import corsMiddleware from "../middlewares/cors.js";

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.use(corsMiddleware);

router.get('/chat', chatView);
router.get('/messageNumber/:id', mensajes_numero);
router.post('/messageFirestore', addMessageFirestore);
router.post('/numeroWhatsapp', checkAuth, numerosWhatsapp);
router.get('/ultimoMensaje/:id', traer_ultimo_mensaje);
router.post('/subir_imagen', uploadImage);
router.post('/subir_imagen_paste', uploadImagePaste);
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
router.get('/chatOne/:id', chatOne);
router.get('/getChatCodigo/:id', getChatCodigo);
router.get('/getAsignationName', asignarAsistenteDataJson);

router.get('/getAgentes', checkAuth,getAgenteId);
router.get('/contactosNoContestados', checkAuth, contactosNoContestados);
router.post('/postPanel', envio_formulario_panel);


export default router;