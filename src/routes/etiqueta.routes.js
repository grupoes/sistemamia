import { Router } from "express";

import { indexView, getAllEtiquetas, getAllEmbudo, saveEtiqueta, getEtiquetaById, deleteEtiqueta, saveEmbudo, getEmbudoById, deleteEmbudo } from "../controllers/etiquetas.controller.js"

const router = Router();

router.get('/etiquetas', indexView);
router.get('/getEtiquetasAll', getAllEtiquetas);
router.get('/allEmbudo', getAllEmbudo);
router.post('/guardarEtiqueta', saveEtiqueta);
router.get('/getEtiqueta/:id', getEtiquetaById);
router.get('/delete-etiqueta/:id', deleteEtiqueta);

router.post('/guardarEmbudo', saveEmbudo);
router.get('/getEmbudoId/:id', getEmbudoById);
router.get('/delete-embudo/:id', deleteEmbudo);

export default router;