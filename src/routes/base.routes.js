import { Router } from "express";
import { getDataToken } from "../controllers/base.controller.js"
import { checkAuth } from "../middlewares/auth.js";
import { checkAuthorization } from "../middlewares/authorization.js";

const router = Router();

router.get('/getData', checkAuthorization, getDataToken);

export default router;