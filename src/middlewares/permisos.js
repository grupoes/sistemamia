import { Usuario } from "../models/usuario.js";
import { Perfil } from "../models/perfil.js";
import { Permisos } from "../models/permisos.js";
import { PerfilesPermisos } from "../models/perfiles_permisos.js";

export const verificarPermisos = (permisosRequeridos,  options = { render: true }) => {
    return async (req, res, next) => {
        try {
            const idusuario = req.usuarioToken._id;
            const usuario = await Usuario.findByPk(idusuario, {
                include: {
                    model: Perfil,
                    attributes: ['id'],
                },
            });
            const perfilIds = usuario.perfiles.map(perfil => perfil.id);
            const permisos = await PerfilesPermisos.findAll({
                where: { idperfil: perfilIds },
                include: {
                    model: Permisos,
                    attributes: ['id', 'nombre'],
                },
            });
            const permisosUnicos = new Set(
                permisos.map(permiso => permiso.permiso.nombre)
            );
            const tienePermiso = permisosRequeridos.some(permiso =>
                permisosUnicos.has(permiso)
            );

            if (!tienePermiso) {
                if (options.render) {
                    return res.status(401).render('no-access/index', {
                        message: 'Lo sentimos, no cuentas con accesos para este módulo.',
                        messageSecondary: 'Contactar con el administrador.',
                    });
                } else {
                    return res.status(401).json({
                        msg: 'No cuentas con los permisos necesarios.',
                    });
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
