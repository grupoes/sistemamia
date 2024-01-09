import { Router } from "express";

import { viewPrincipal, saveNumeroWhatsappVentas, allWhatsapp, updateStatusWhatsapp, getWhatsappVenta } from "../controllers/whatsappVentas.controller.js"

const router = Router();

router.get('/whatsapp-ventas', viewPrincipal);
router.post('/addNumeroWhatsappVentas', saveNumeroWhatsappVentas);
router.get('/allWhatsapp', allWhatsapp);
router.post('/updateStatusWhatsapp', updateStatusWhatsapp);
router.get('/getWhatsappVenta/:id', getWhatsappVenta);

export default router;