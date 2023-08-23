import { Router } from "express";
import { getPotencialClientes } from "../controllers/potencialCliente.controller.js";

const router = Router();

router.get('/all-clientes-potenciales', getPotencialClientes);

export default router;