import { Router } from "express";

import { viewActividades, createActivity, allActivities, getActivity, updateActivity, updataStatus } from "../controllers/actividades.controller.js"

const router = Router();

router.get('/actividades', viewActividades);
router.post('/activities', createActivity);
router.get('/activities', allActivities);
router.get('/activities/:id', getActivity);
router.put('/activities/:id', updateActivity);
router.put('/activities-status/:id', updataStatus);

export default router;