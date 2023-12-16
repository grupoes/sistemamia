import { Router } from "express";

import { getPlantillas, sendPlantilla, getPlantilla, viewIndex, apiGetTemplateAll,createTemplate } from "../controllers/plantilla.controller.js"

const router = Router();

router.get('/plantillas', viewIndex);
router.get('/getPlantillas', getPlantillas);
router.get('/getPlantilla/:id', getPlantilla);
router.post('/sendPlantilla', sendPlantilla);
router.get('/apiGetTemplateAll', apiGetTemplateAll);
router.post('/create-template', createTemplate);

export default router;