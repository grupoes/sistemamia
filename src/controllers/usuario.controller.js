import { Usuario } from "../models/usuario.js";
import { Trabajadores } from "../models/trabajadores.js";

export const index = (req, res) => {
    res.render('usuario/index', { layout: 'partials/main' });
}

export const allUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            where: {
                estado: 1
            },
            include: Trabajadores
        });

        res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}