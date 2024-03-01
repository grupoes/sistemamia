import { Router } from "express";

import { getAllUbigeo, api_dni } from "../controllers/base.controller.js";
import { index, allUsers } from "../controllers/usuario.controller.js";

const router = Router();

router.get('/usuarios', index);
router.get('/users', allUsers);

router.get('/ubigeos', getAllUbigeo);
router.get('/api-dni/:id', api_dni);

export default router;