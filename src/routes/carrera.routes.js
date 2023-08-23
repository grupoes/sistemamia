import { Router } from "express";

import { allCarreras, getCarrera, createCarrera, updateCarrera } from "../controllers/carrera.controller.js";

const router = Router();

router.get('/carrera/all', allCarreras);
router.get('/carrera/:id', getCarrera);
router.post('/carrera/create', createCarrera);

export default router;