import { Router } from "express";

import { getPlantillas, sendPlantilla, getPlantilla, viewIndex } from "../controllers/plantilla.controller.js"

const router = Router();

router.get('/plantillas', viewIndex);
router.get('/getPlantillas', getPlantillas);
router.get('/getPlantilla/:id', getPlantilla);
router.post('/sendPlantilla', sendPlantilla);

export default router;