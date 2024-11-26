import { verifyToken } from "../helpers/generarToken.js";
import { Usuario } from "../models/usuario.js";

export const checkAuthorization = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.redirect('/');
        }
        const tokenData = await verifyToken(token);
        if (!tokenData || !tokenData._id) {
            return res.redirect('/');
        }
        const idusuario = tokenData._id;
        const usuario = await Usuario.findByPk(idusuario);
        if (!usuario) {
            return res.redirect('/');
        }
        req.usuarioToken = tokenData;
        next();
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un error al verificar el token.",
            error: error.message,
        });
    }
};
