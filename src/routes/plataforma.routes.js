import { Router } from "express";

import { getPlataformas } from "../controllers/plataforma.controller.js"

const router = Router();

router.get('/getPlataformas', getPlataformas);

export default router;