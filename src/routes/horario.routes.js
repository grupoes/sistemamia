import { Router } from "express";

import { viewHorarioGeneral, viewHorario, horarioAuxiliar, viewHorarioEjemplo, verificarDisponibilidad, saveHorario, addTrabajoHorario, renderAsistentes, renderJefesProduccion, reorganizarHorario, calcularIntervalosTrabajo } from "../controllers/horario.controller.js"

const router = Router();

router.get('/horario-general', viewHorarioGeneral);
router.get('/horarios', viewHorario);
router.get('/horario-auxiliar-calendar/:id', horarioAuxiliar);

router.get('/horario-ejemplo', viewHorarioEjemplo);
router.get('/render-asistentes', renderAsistentes);
router.get('/render-jefes', renderJefesProduccion);
router.get('/reorganizarHorario', reorganizarHorario);

router.post('/calcular-intervalo', calcularIntervalosTrabajo);


router.post('/disponibilidad', verificarDisponibilidad);
router.post('/guardarTrabajo', saveHorario);
router.post('/api/trabajo-horario', addTrabajoHorario);

export default router;