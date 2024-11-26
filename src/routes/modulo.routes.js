import { Router } from "express";
import { verificarPermisos } from "../middlewares/permisos.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { index, getAllModulos, getAllActions,getModuleFather, crearOEditar, getModule, eliminarORestaurar } from "../controllers/modulo.controller.js"

const router = Router();

router.get('/modulo', checkAuthorization, verificarPermisos(['modulo:listar'],  { render: true }), index);
router.get('/render-modulos', checkAuthorization, verificarPermisos(['modulo:listar'],  { render: false }), getAllModulos);
router.get('/listActions', getAllActions);
router.get('/getModulePadres', getModuleFather);
router.post('/modulo/crear-o-editar', checkAuthorization, verificarPermisos(['modulo:crear', 'modulo:editar'], { render: false }), crearOEditar);
router.delete('/modulo/eliminar-o-restaurar', checkAuthorization, verificarPermisos(['modulo:eliminar_restaurar'], { render: false }), eliminarORestaurar);
router.get('/getModule/:id', getModule);

export default router;