import {Router} from 'express';
import { getListProfiles, saveProfile, viewProfiles, deleteProfile } from "../controllers/perfiles.controller.js";

const router = Router();
router.get('/perfiles', viewProfiles);
router.get('/listProfiles', getListProfiles);
router.post('/saveProfile', saveProfile);
router.get('/deleteOrRestoreProfile', deleteProfile);
export default router;