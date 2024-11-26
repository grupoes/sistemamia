import { Router } from "express";

import { viewHorarioGeneral, viewHorario, horarioAuxiliar, viewHorarioEjemplo, verificarDisponibilidad, saveHorario, addTrabajoHorario } from "../controllers/horario.controller.js"

const router = Router();

router.get('/horario-general', viewHorarioGeneral);
router.get('/horarios', viewHorario);
router.get('/horario-auxiliar-calendar/:id', horarioAuxiliar);

router.get('/horario-ejemplo', viewHorarioEjemplo);

router.post('/disponibilidad', verificarDisponibilidad);
router.post('/guardarTrabajo', saveHorario);
router.post('/api/trabajo-horario', addTrabajoHorario);

export default router;