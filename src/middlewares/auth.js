import { verifyToken } from "../helpers/generarToken.js";

export const checkAuth = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ').pop();

        const tokenData = await verifyToken(token);

        if (tokenData._id) {
            req.usuarioToken = tokenData
            next();
        } else {
            return res.status(401).json({
                msg: "usuario no existe"
            })
        }
    } catch (error) {
        res.status(401).json({
            msg: error.message
        })
    }
}