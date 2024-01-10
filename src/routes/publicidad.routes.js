import { Router } from "express";

import { indexView, addPublicidad, uploadSingle, getAllPublicidad, disabledPublicidad, deletePublicidad, getPublicidadById } from "../controllers/publicidad.controller.js"

const router = Router();

router.get('/lista-publicidad', indexView);
router.post('/save-publicidad', uploadSingle, addPublicidad);
router.get('/allPublicidad', getAllPublicidad);
router.post('/disabled-publicidad', disabledPublicidad);
router.get('/delete-publicidad/:id', deletePublicidad);
router.get('/getPublicidad/:id', getPublicidadById);

export default router;