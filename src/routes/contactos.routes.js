import { Router } from "express";

import { FiltroContact } from "../controllers/whatsapp.controller.js"

const router = Router();

router.post('/filtroContact', FiltroContact);

export default router;