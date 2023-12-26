import { Router } from "express";

import { index } from "../controllers/usuario.controller.js"

const router = Router();

router.get('/usuarios', index);

export default router;