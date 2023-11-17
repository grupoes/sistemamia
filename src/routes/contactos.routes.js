import { Router } from "express";

import { FiltroContact, getContactos, reenviarMensaje } from "../controllers/whatsapp.controller.js"

const router = Router();

router.post('/filtroContact', FiltroContact);
router.post('/obtenerContactos', getContactos);
router.post('/reenviarMensaje', reenviarMensaje);

export default router;