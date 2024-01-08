import { Router } from "express";

import { viewPrincipal, saveNumeroWhatsappVentas, allWhatsapp, updateStatusWhatsapp } from "../controllers/whatsappVentas.controller.js"

const router = Router();

router.get('/whatsapp-ventas', viewPrincipal);
router.post('/addNumeroWhatsappVentas', saveNumeroWhatsappVentas);
router.get('/allWhatsapp', allWhatsapp);
router.post('/updateStatusWhatsapp', updateStatusWhatsapp);

export default router;