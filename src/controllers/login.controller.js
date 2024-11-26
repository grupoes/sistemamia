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
        res.cookie('token', tokenSession, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 2,
            sameSite: 'Strict'
        });

        const data = {
            message: "ok",
            user: user,
            token: tokenSession
        };
        req.user = {
            id: user.id,
            permisos: {}
        };
        console.log(data);

        return res.json(data);

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
        return res.redirect('/');
    } catch (error) {
        return res.status(500).json({ message: 'Error al cerrar sesión.' });
    }
}