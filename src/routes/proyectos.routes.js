import { Router } from "express";
import { verificarPermisos } from "../middlewares/permisos.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { viewPrincipal } from "../controllers/proyecto.controller.js"

const router = Router();

router.get('/proyectos', checkAuthorization, verificarPermisos(['proyectos:listar']), viewPrincipal);

export default router;