import { Router } from "express";

import { FiltroContact, getContactos } from "../controllers/whatsapp.controller.js"

const router = Router();

router.post('/filtroContact', FiltroContact);
router.post('/obtenerContactos', getContactos);

export default router;