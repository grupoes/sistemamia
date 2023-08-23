import { Router } from "express";

import { allAreas, getArea, createArea, updateArea } from "../controllers/area.controller.js"

const router = Router();

router.get('/area/all', allAreas);
router.get('/area/:id', getArea);
router.post('/area/create', createArea);
router.put('/area/:id', updateArea);

export default router;