import { Router } from "express";

import { allCargos, getCargo, createCargo } from "../controllers/cargo.controller.js"

const router = Router();

router.get('/cargo/all', allCargos);
router.get('/cargo/:id', getCargo);
router.post('/cargo/create', createCargo);

export default router;