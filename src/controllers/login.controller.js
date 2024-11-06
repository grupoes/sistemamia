import { Usuario } from "../models/usuario.js";
import { Trabajadores } from "../models/trabajadores.js";

import { tokenSing } from "../helpers/generarToken.js";

export const loginView = (req, res) => {
    res.render('login/login');
}

export const sigin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usuario.findOne({
            where: {
                correo: email,
                password: password
            },
            include: Trabajadores
        });

        if (!user) {
            return res.status(404).send({ message: 'El usuario o contraseña no coinciden' })
        }

        const tokenSession = await tokenSing(user);

        const data = {
            message: "ok",
            user: user,
            token: tokenSession
        };

        console.log(data);

        return res.json(data);

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}