import { Router } from "express";
import { index, listarBandeja, crearOEditar, eliminarORestaurar } from "../controllers/modulo_padre.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { verificarPermisos } from "../middlewares/permisos.js";

const router = Router();
router.get('/modulo_padre', checkAuthorization, verificarPermisos(['modulo_padre:listar'],  { render: true }), index);
router.get('/modulo_padre/bandeja', checkAuthorization, verificarPermisos(['modulo_padre:listar'],  { render: false }), listarBandeja);
router.post('/modulo_padre/crear-o-editar', checkAuthorization, verificarPermisos(['modulo_padre:crear', 'modulo_padre:editar'], { render: false }), crearOEditar);
router.delete('/modulo_padre/eliminar-o-restaurar', checkAuthorization, verificarPermisos(['modulo_padre:eliminar_restaurar'], { render: false }), eliminarORestaurar);
export default router;