import { Router } from "express";

import { loginView, sigin } from "../controllers/login.controller.js";

const router = Router();

router.get('/', loginView);
router.post('/sigin', sigin);

export default router;