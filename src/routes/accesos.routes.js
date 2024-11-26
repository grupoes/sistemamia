import {Router} from "express";
import { index, listarModulosConPermisos, asignarPermisos, listarModulosPermisosPorPerfiles } from "../controllers/accesos.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { verificarPermisos } from "../middlewares/permisos.js";

const router = Router();
router.get('/accesos', checkAuthorization, verificarPermisos(['accesos:listar'],  { render: true }), index);
router.get('/accesos/listar-modulos-permisos/:idperfil', checkAuthorization, verificarPermisos(['accesos:listar'],  { render: false }), listarModulosConPermisos);
router.post('/accesos/asignar-permisos', checkAuthorization, verificarPermisos(['accesos:crear'],  { render: false }), asignarPermisos);
router.get('/accesos/listar-modulos-por-perfiles/:idusuario', listarModulosPermisosPorPerfiles);
export default router;