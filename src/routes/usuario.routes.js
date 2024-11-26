import { Router } from "express";
import { getAllUbigeo, api_dni } from "../controllers/base.controller.js";
import { index, allUsers, guardarUsuario, deleteOrRestore, listarEspecialidadesPorIdCarrera } from "../controllers/usuario.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { verificarPermisos } from "../middlewares/permisos.js";

const router = Router();

router.get('/usuarios', checkAuthorization, verificarPermisos(['usuarios:listar'],  { render: true }), index);
router.get('/users', checkAuthorization, verificarPermisos(['usuarios:listar'],  { render: false }), allUsers);
router.get('/ubigeos', getAllUbigeo);
router.get('/api-dni/:id', api_dni);
router.post('/guardar_usuario', checkAuthorization, verificarPermisos(['usuarios:crear', 'usuarios:editar'], { render: false }), guardarUsuario);
router.delete('/deleteOrRestoreUser', checkAuthorization, verificarPermisos(['usuarios:eliminar_restaurar'], { render: false }), deleteOrRestore);
router.get('/especialidades/carrera/:idCarrera', listarEspecialidadesPorIdCarrera);
export default router;