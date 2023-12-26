import { Modulos } from "../models/modules.js";
import { Actions } from "../models/actions.js";

export const index = (req, res) => {
    const timestamp = Date.now();

    const css = [
        'assets/libs/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css'
    ];

    const js = [
        'assets/libs/datatables.net/js/jquery.dataTables.min.js',
        'assets/libs/datatables.net-bs4/js/dataTables.bootstrap4.min.js',
        'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js',
        '/js/modulos.js'+ '?t=' + timestamp
    ];

    res.render('modulo/index', { layout: 'partials/main', css, js });
}

export const getAllModulos = async (req, res) => {
    try {
        const modulos = await Modulos.findAll({
            where: {
                status: 'activo'
            },
            order: [
                ['id', 'asc']
            ]
        });

        for (const modulo of modulos) {
            if (modulo.fatherId != 0) {
                const moduloPadre = await Modulos.findOne({
                    where: {
                        id: modulo.fatherId
                    }
                });
                let plainObject = modulo.get({ plain: true });
                plainObject.moduloPadre = moduloPadre.get({ plain: true });
            }
        }

        return res.status(200).json({status: "ok", data: modulos});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

export const getAllActions = async (req, res) => {
    try {
        const actions = await Actions.findAll({
            where: {
                status: 'activo'
            }
        });

        return res.status(200).json({status: "ok", data: actions});
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const getModuleFather = async (req, res) => {
    try {
        const padres = await Modulos.findAll({
            where: {
                fatherId: 0
            }
        });

        return res.status(200).json({ status: 'ok', data: padres });
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}

export const createModule = (req, res) => {
    try {
        return res.json(req.body.actions);
    } catch (error) {
        return res.status(400).json({status: 'error', message: error.message});
    }
}