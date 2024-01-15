import { Router } from "express";

import { viewPrincipal } from "../controllers/proyecto.controller.js"

const router = Router();

router.get('/proyectos', viewPrincipal);

export default router;