import { Router } from "express";
import {
  chatView,
  mensajes_numero,
  addMessageFirestore,
  numerosWhatsapp,
  uploadImage,
  asignarClienteAUnTrabajador,
  insertChat,
  uploadAudio,
  audioMiddleware,
  getEmbudoEtiqueta,
  getEtiquetaEmbudo,
  actualizarEtiqueta,
  enviar_mensaje_icono_whatsapp,
  socketMensaje,
  getEmpleadosAsignar,
  asignarAsistente,
  chatOne,
  getChatCodigo,
  contactosNoContestados,
  uploadImagePaste,
  envio_formulario_panel,
  delete_contacto,
  updateLoadContact,
  findIdChat,
  statusMensajeCodigo,
  interaccionesContacto,
  listChat,
  chatContactDetail,
  searchChatList,
  enviopdf,
  multerSinglePdf,
  listaContactoEtiqueta,
  getActivityEtiqueta
} from "../controllers/chat.controller.js";

import {
  getAgenteId,
  asignarAsistenteDataJson,
} from "../controllers/base.controller.js";

import corsMiddleware from "../middlewares/cors.js";

import { checkAuthorization } from "../middlewares/authorization.js";

const router = Router();

router.use(corsMiddleware);

router.get("/chat", chatView);
router.get("/messageNumber/:id", mensajes_numero);
router.post("/messageFirestore", addMessageFirestore);
router.post("/numeroWhatsapp", checkAuthorization, numerosWhatsapp);
router.post("/subir_imagen", uploadImage);
router.post("/subir_imagen_paste", uploadImagePaste);
router.post("/actualizarEtiqueta", actualizarEtiqueta);
router.get("/welcome/:id", asignarClienteAUnTrabajador);
router.post("/insertChat", insertChat);
router.post("/uploadAudio", audioMiddleware, uploadAudio);
router.get("/getEmbudoEtiqueta/:id", getEmbudoEtiqueta);
router.get("/getEtiquetaEmbudo/:id", getEtiquetaEmbudo);
router.post("/sendMensajeWhatsapp", enviar_mensaje_icono_whatsapp);
router.get("/socketMensaje/:id", socketMensaje);
router.get("/getEmpleadosAsignar", getEmpleadosAsignar);
router.post("/asignarAsistente", asignarAsistente);
router.get("/chatOne/:id", chatOne);
router.get("/getChatCodigo/:id", getChatCodigo);
router.get("/getAsignationName", asignarAsistenteDataJson);

router.get("/getAgentes", checkAuthorization, getAgenteId);
router.get("/contactosNoContestados", checkAuthorization, contactosNoContestados);
router.post("/postPanel", envio_formulario_panel);
router.get("/deleteContact/:id", checkAuthorization, delete_contacto);

router.post("/actualizarContactList", checkAuthorization, updateLoadContact);

router.get("/chatId/:id", findIdChat);
router.get("/statusMessageCodigo/:id", statusMensajeCodigo);

router.post("/interacciones", interaccionesContacto);

router.get("/lista-chat/:idEtiqueta/:idPlataforma", checkAuthorization, listChat);
router.get('/getContactoData/:id', checkAuthorization, chatContactDetail);
router.get('/searchMessage/:search', checkAuthorization, searchChatList);

router.post('/enviopdf/', multerSinglePdf, enviopdf);
router.get('/getListaContactoEtiqueta/:embudo/:etiqueta', checkAuthorization, listaContactoEtiqueta);

router.get('/getActivityEtiqueta/:id', getActivityEtiqueta);

export default router;
