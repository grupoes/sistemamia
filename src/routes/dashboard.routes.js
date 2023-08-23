import { Router } from "express";

import { dashboardView } from "../controllers/dashboard.controller.js";

const router = Router();

router.get('/dashboard', dashboardView);

export default router;