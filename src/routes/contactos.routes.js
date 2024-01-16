import { Router } from "express";

import { FiltroContact, getContactos, reenviarMensaje, emojisAll, addSeguimiento, allSeguimiento, listaSeguimientos, deleteSeguimiento } from "../controllers/whatsapp.controller.js"

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/filtroContact', checkAuth, FiltroContact);
router.post('/obtenerContactos', getContactos);
router.post('/reenviarMensaje', reenviarMensaje);
router.get('/emojisAll', emojisAll);
router.post('/add-seguimiento', addSeguimiento);
router.get('/all-seguimientos/:id', allSeguimiento);
router.get('/lista-seguimientos', listaSeguimientos);
router.get('/delete-seguimiento/:id', deleteSeguimiento);

export default router;