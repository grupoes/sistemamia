import { Router } from "express";
import { crearOEditar, index, listarBandeja, eliminarORestaurar } from "../controllers/funcion.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { verificarPermisos } from "../middlewares/permisos.js";

const router = Router();
router.get('/funcion', checkAuthorization, verificarPermisos(['funcion:listar'],  { render: true }), index);
router.get('/funcion/bandeja', checkAuthorization, verificarPermisos(['funcion:listar'],  { render: false }), listarBandeja);
router.post('/funcion/crear-o-editar',  checkAuthorization, verificarPermisos(['funcion:crear', 'funcion:editar'], { render: false }), crearOEditar);
router.delete('/funcion/eliminar-o-restaurar', checkAuthorization, verificarPermisos(['funcion:eliminar_restaurar'], { render: false }), eliminarORestaurar)
export default router;
