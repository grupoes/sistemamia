import { Router } from "express";

import { viewPotenciales } from "../controllers/clientes.controller.js"

const router = Router();

router.get('/clientes-potenciales', viewPotenciales);

export default router;