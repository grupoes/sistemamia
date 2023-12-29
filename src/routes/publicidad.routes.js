import { Router } from "express";

import { indexView, addPublicidad, uploadSingle } from "../controllers/publicidad.controller.js"

const router = Router();

router.get('/lista-publicidad', indexView);
router.post('/save-publicidad', uploadSingle, addPublicidad);

export default router;