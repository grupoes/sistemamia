import { Router } from "express";

import { allAreas, getArea, createArea, updateArea } from "../controllers/area.controller.js"

const router = Router();

router.get('/areas', allAreas);
router.get('/areas/:id', getArea);
router.post('/areas', createArea);
router.put('/areas/:id', updateArea);

export default router;