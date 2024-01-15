import { Router } from "express";

import { viewHorarioGeneral } from "../controllers/horario.controller.js"

const router = Router();

router.get('/horario-general', viewHorarioGeneral);

export default router;