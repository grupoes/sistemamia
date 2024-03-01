import { Usuario } from "../models/usuario.js";
import { Trabajadores } from "../models/trabajadores.js";
import { Area } from "../models/area.js";
import { TipoTrabajo } from "../models/tipoTrabajo.js";

export const index = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css',
        'assets/libs/select2/css/select2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        'assets/libs/select2/js/select2.min.js',
        '/js/usuario.js'+ '?t=' + timestamp
    ];

    res.render('usuario/index', { layout: 'partials/main', css, js });
}

export const allUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            where: {
                estado: 1
            },
            include: [
                {
                    model: Trabajadores,
                    include: [
                        {
                            model: Area
                        },
                        {
                            model: TipoTrabajo
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ status: 'ok', data: users });
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}