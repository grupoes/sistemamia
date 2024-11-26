import { Router } from "express";

import { loginView, sigin, logout } from "../controllers/login.controller.js";

const router = Router();

router.get('/', loginView);
router.post('/sigin', sigin);
router.get('/logout', logout);

export default router;