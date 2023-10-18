import { Router } from "express";

import { viewPotenciales, viewCreatePotencial } from "../controllers/clientes.controller.js"

const router = Router();

router.get('/clientes-potenciales', viewPotenciales);
router.get('/crear-potencial-cliente', viewCreatePotencial);

export default router;