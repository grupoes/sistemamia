import { Funcion } from "../models/funcion.js";

export const index = async (req, res) => {
    const timestamp = Date.now();
    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        "assets/css/chosen.min.css",
    ];
    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/funcion.js'+ '?t=' + timestamp
    ];
    res.render('funcion/index', { layout: 'partials/main', css, js });
}

export const listarBandeja = async(req, res, next) => {
    try {
        const data = await Funcion.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [
                ['id', 'asc']
            ]
        });
        return res.status(200).json({
            success: true,
            data: data,
            message: "Datos obtenidos exitosamente.",
        });

    } catch (error) {
        next(error);
    }
}

export const crearOEditar = async(req, res , next) => {
    try {
        const {id, nombre, funcion, icono, clase, de_registro, orden} = req.body;
        if(id === null) {
            await Funcion.create({
                nombre: nombre,
                funcion: funcion,
                icono: icono,
                clase: clase,
                de_registro: de_registro,
                orden: orden,
            });
            return res.status(201).json({
                success: true,
                message: "Función creada.",
            });
        }else {
            await Funcion.update({ 
                nombre: nombre,
                funcion: funcion,
                icono: icono,
                clase: clase,
                de_registro: de_registro,
                orden: orden,
            }, {
                where: { 
                    id: id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Función actualizada.",
            });
        }
    } catch (error) {
        next(error);
    }
}

export const eliminarORestaurar = async (req, res, next) => {
    try {
        const { id, estado } = req.query;
        const nuevoEstado = estado == 0 ? 1 : 0;
        await Funcion.update(
            {
                estado: nuevoEstado
            },
            {
                where: {
                    id: id
                }
            }
        );
        return res.status(200).json({
            success: true,
            message: `Función ${nuevoEstado === 1 ? 'restaurada' : 'eliminada'}.`
        });
    } catch (error) {
        return next(error);
    }
}