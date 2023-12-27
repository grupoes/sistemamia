import { Router } from "express";

import { index, getAllModulos, getAllActions,getModuleFather, createModule, getModule } from "../controllers/modulo.controller.js"

const router = Router();

router.get('/modulos', index);
router.get('/render-modulos', getAllModulos);
router.get('/listActions', getAllActions);
router.get('/getModulePadres', getModuleFather);
router.post('/create-module', createModule);
router.get('/getModule/:id', getModule);

export default router;