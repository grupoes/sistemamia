import { Router } from "express";

import { getPlantillas } from "../controllers/plantilla.controller.js"

const router = Router();

router.get('/getPlantillas', getPlantillas);

export default router;