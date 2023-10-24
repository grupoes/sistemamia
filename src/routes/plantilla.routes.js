import { Router } from "express";

import { getPlantillas, sendPlantilla } from "../controllers/plantilla.controller.js"

const router = Router();

router.get('/getPlantillas', getPlantillas);
router.get('/sendPlantilla', sendPlantilla);

export default router;