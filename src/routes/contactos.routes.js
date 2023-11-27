import { Router } from "express";

import { FiltroContact, getContactos, reenviarMensaje } from "../controllers/whatsapp.controller.js"

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post('/filtroContact', checkAuth, FiltroContact);
router.post('/obtenerContactos', getContactos);
router.post('/reenviarMensaje', reenviarMensaje);

export default router;