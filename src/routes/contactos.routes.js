import { Router } from "express";

import { FiltroContact, getContactos, reenviarMensaje, emojisAll, addSeguimiento, allSeguimiento } from "../controllers/whatsapp.controller.js"

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/filtroContact', checkAuth, FiltroContact);
router.post('/obtenerContactos', getContactos);
router.post('/reenviarMensaje', reenviarMensaje);
router.get('/emojisAll', emojisAll);
router.post('/add-seguimiento', addSeguimiento);
router.get('/all-seguimientos/:id', allSeguimiento);

export default router;