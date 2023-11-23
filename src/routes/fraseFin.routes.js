import { Router } from "express";

import { viewFrase, allFrases, createFrase, deleteFrase } from "../controllers/frasesRestringuidasChat.controller.js"

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/frases-restringuidas', viewFrase);
router.get('/getFrasesFin', allFrases);
router.post('/saveFrase', checkAuth, createFrase);
router.get('/deleteFrase/:id', deleteFrase);

export default router;