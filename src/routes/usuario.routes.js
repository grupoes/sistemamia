import { Router } from "express";

import { getAllUbigeo, api_dni } from "../controllers/base.controller.js";
import { index, allUsers, guardarUsuario, deleteOrRestore, listarEspecialidadesPorIdCarrera } from "../controllers/usuario.controller.js";

const router = Router();

router.get('/usuarios', index);
router.get('/users', allUsers);

router.get('/ubigeos', getAllUbigeo);
router.get('/api-dni/:id', api_dni);
router.post('/guardar_usuario', guardarUsuario);
router.delete('/deleteOrRestoreUser', deleteOrRestore);
router.get('/especialidades/carrera/:idCarrera', listarEspecialidadesPorIdCarrera);
export default router;