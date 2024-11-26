import {Router} from 'express';
import { getListProfiles, saveProfile, viewProfiles, deleteProfile } from "../controllers/perfiles.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";
import { verificarPermisos } from "../middlewares/permisos.js";

const router = Router();
router.get('/perfiles', checkAuthorization, verificarPermisos(['perfiles:listar'],  { render: true }), viewProfiles);
router.get('/listProfiles', checkAuthorization, verificarPermisos(['perfiles:listar'],  { render: false }), getListProfiles);
router.post('/saveProfile', checkAuthorization, verificarPermisos(['perfiles:crear', 'perfiles:editar'], { render: false }), saveProfile);
router.get('/deleteOrRestoreProfile', checkAuthorization, verificarPermisos(['perfiles:eliminar_restaurar'], { render: false }), deleteProfile);
export default router;