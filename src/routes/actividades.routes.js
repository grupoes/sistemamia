import { Router } from "express";

import { viewActividades, createActivity, allActivities, getActivity, updateActivity, updataStatus, actividadesPerfil, savePerfilActivity, deleteActivityPerfil, saveAllPerfilActivity, deletePerfilActivityAll } from "../controllers/actividades.controller.js"

const router = Router();

router.get('/actividades', viewActividades);
router.post('/activities', createActivity);
router.get('/activities', allActivities);
router.get('/activities/:id', getActivity);
router.put('/activities/:id', updateActivity);
router.put('/activities-status/:id', updataStatus);
router.get('/activities-perfil/:id', actividadesPerfil);
router.post('/activities-perfil', savePerfilActivity);
router.delete('/activities-perfil/:perfil/:activity', deleteActivityPerfil);
router.post('/activities-perfil-all', saveAllPerfilActivity);
router.get('/activities-perfil-all/:id', deletePerfilActivityAll);

export default router;