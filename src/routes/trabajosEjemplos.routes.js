import { Router } from "express";

import { viewHorarioGeneral } from "../controllers/TrabajosEjemplos.controller.js"

const router = Router();

router.post('/api/agregarTrabajo', viewHorarioGeneral);

export default router;