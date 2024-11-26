import { Modulo_padre } from "../models/module_padre.js";

export const index = async (req, res) => {
    const timestamp = Date.now();
    const css = [
        "assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css",
        "assets/css/chosen.min.css",
    ];
    const js = [
        "assets/libs/datatables.net/js/jquery.dataTables.min.js",
        "assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js",
        "assets/js/chosen.jquery.min.js",
        "/js/modulo_padre.js",
    ];

    res.render("modulo_padre/index", {layout: 'partials/main', css, js});
}

export const listarBandeja = async(req, res, next) => {
    try {
        const data = await Modulo_padre.findAll({
            order: [['id', 'ASC']]
        });        
        return res.status(200).json({
            success: true,
            data: data,
            message: "Datos obtenidos exitosamente.",
        });
    } catch (error) {
        return next(error); 
    }
}

export const crearOEditar = async(req, res, next) => {
    try {
        const {id, nombre, enlace, icono, orden} = req.body;
        if (id === null) {
            await Modulo_padre.create({
                nombre: nombre,
                enlace: enlace,
                icono: icono,
                orden: orden,
            });
            return res.status(201).json({
                success: true,
                message: "Módulo padre creado.",
            });
        }else {
            await Modulo_padre.update({ 
                nombre: nombre,
                enlace: enlace,
                icono: icono,
                orden: orden,
            }, {
                where: { 
                    id: id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Modulo padre actualizado.",
            });
        }
        
    } catch (error) {
        return next(error);
    }
}

export const eliminarORestaurar = async (req, res, next) => {
    try {
        const { id, estado } = req.query;
        const nuevoEstado = estado == 0 ? 1 : 0;
        await Modulo_padre.update(
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
            message: `Módulo padre ${nuevoEstado === 1 ? 'restaurado' : 'eliminado'}.`
        });
    } catch (error) {
        return next(error);
    }
}