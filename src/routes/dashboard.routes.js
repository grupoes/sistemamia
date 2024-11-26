import { Router } from "express";
import { dashboardView } from "../controllers/dashboard.controller.js";
import { checkAuthorization } from "../middlewares/authorization.js";

const router = Router();

router.get('/dashboard', checkAuthorization, dashboardView);

export default router;