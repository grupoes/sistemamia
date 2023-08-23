import { Router } from "express";

import { createTypeJob, allTipoTrabajo } from "../controllers/tipoTrabajo.controller.js"

const router = Router();

router.get('/tipo-trabajo/all', allTipoTrabajo);
router.post('/tipo-trabajo/create', createTypeJob);

export default router;