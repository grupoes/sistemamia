import { Router } from "express";

import { viewHorarioGeneral, viewHorario, horarioAuxiliar, viewHorarioEjemplo } from "../controllers/horario.controller.js"

const router = Router();

router.get('/horario-general', viewHorarioGeneral);
router.get('/horarios', viewHorario);
router.get('/horario-auxiliar-calendar/:id', horarioAuxiliar);

router.get('/horario-ejemplo', viewHorarioEjemplo);

export default router;