import { Router } from "express";

import { viewHorarioGeneral, viewHorario, horarioAuxiliar } from "../controllers/horario.controller.js"

const router = Router();

router.get('/horario-general', viewHorarioGeneral);
router.get('/horarios', viewHorario);
router.get('/horario-auxiliar-calendar/:id', horarioAuxiliar);

export default router;