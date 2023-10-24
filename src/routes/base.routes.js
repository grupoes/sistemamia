import { Router } from "express";

import { getDataToken } from "../controllers/base.controller.js"

import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get('/getData', checkAuth, getDataToken);

export default router;